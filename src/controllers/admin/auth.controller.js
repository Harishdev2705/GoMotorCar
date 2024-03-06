const service = require("../../services/mongodb.services");
const Location = require('../../models/customerAddress.model')
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { User } = require("../../models/index");
const messages = require("../../utility/message");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../../helper/sendEmail");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../utility/config");
const { uploadToS3, deleteToS3 } = require("../../middlewares/aws-config");

/**
 * @description - This function is used for user signup
 */
const signup = async (req, res, next) => {
  try {
    let { name, email, password, fcmToken } = req.body;

    let checkDelete = await service.findOneForAwait(
      User,
      { email, isDeleted: true },
      {}
    );
    console.log("checkDelete", checkDelete);
    if (checkDelete) {
      let newUser = await new User({
        name,
        role: "admin",
        email,
        password: await commonHelper.encryptPassword(password),
        fcmToken,
      });

      await service.createForAwait(newUser);
      const token = await commonHelper.generateToken({
        email,
        role: "admin",
        id: newUser._id,
      });

      await service.findOneAndUpdateForAwait(User, { email }, { token: token });

      return new SuccessResponse(messages.success.signup, {
        token,
        user: newUser,
      }).send(res);
    } else {
      let user = await service.findOneForAwait(
        User,
        { email, isDeleted: false },
        {}
      );
      if (user) throw new BadRequest(messages.error.emailAlreadyExist);

      let newUser = await new User({
        name,
        role: "admin",
        email,
        password: await commonHelper.encryptPassword(password),
        fcmToken,
      });

      await service.createForAwait(newUser);
      const token = await commonHelper.generateToken({
        email,
        role: "admin",
        id: newUser._id,
      });

      await service.findOneAndUpdateForAwait(User, { email }, { token: token });

      return new SuccessResponse(messages.success.signup, {
        token,
        user: newUser,
      }).send(res);
    }
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for email login
 */
const emailLogin = async (req, res, next) => {
  try {
    let { email, password, fcmToken } = req.body;
    let user = await service.findOneForAwait(
      User,
      { email, isDeleted: false, role: "admin" },
      { token: 0 }
    );
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    if (user.isBlocked) {
      throw new BadRequest(messages.error.blockUser);
    }
    const isMatch = await commonHelper.comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequest(messages.error.invalidPassword);
    }
    const token = await commonHelper.generateToken({
      email: email,
      role: "admin",
      id: user._id,
    });

    await service.findOneAndUpdateForAwait(
      User,
      { email },
      { token: token, fcmToken: fcmToken }
    );

    return new SuccessResponse(messages.success.login, {
      token,
      user,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * This Functions is used for update name and email of user
 */

const updateProfile = async (req, res, next) => {
  try {
    let { name, mobile, about } = req.body;
    let profile_photo = req.file;

    let user = await service.findOneForAwait(
      User,
      { _id: req.user._id, role: "admin" },
      {}
    );

    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    if (!profile_photo) {
      await service.findOneAndUpdateForAwait(
        User,
        { _id: req.user._id },
        { name, mobile, about }
      );
    } else {
      // Delete the old profile image if it exists
      if (user.profile_photo) {
        const oldImagePath = path.join("uploads/", user.profile_photo);
        fs.unlink(oldImagePath, (err) => {
          if (err) {
            // Handle the error if necessary
            console.error("========", err);
          }
        });
      }

      // Construct the image URL
      // const imageUrl = `images/${profile_photo.filename}`;

      const imageUrl = await uploadToS3(profile_photo.filename, profile_photo.path);

      await service.findOneAndUpdateForAwait(
        User,
        { _id: req.user._id },
        { name, mobile, about, profile_photo: imageUrl }
      );
    }

    let userNew = await service.findOneForAwait(
      User,
      { _id: req.user._id, role: "admin" },
      {}
    );

    return new SuccessResponse(messages.success.updateProfile, {
      user: userNew,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    let { emailOrPhone } = req.body;

    emailOrPhone = emailOrPhone.toLowerCase();

    let user = await service.findOneForAwait(
      User,
      { email: emailOrPhone, isDeleted: false },
      {}
    );

    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    let email = user.email;

    // token generation
    const token = await commonHelper.generateToken({
      email,
      role: user.role,
      id: user._id,
    });

    const otp = await commonHelper.generateOTP(4);

    await service.findOneAndUpdateForAwait(
      User,
      { email },
      { token: token, otp: otp }
    );

    // send OTP via email

    await sendEmail.sendEmailOTPFun(
      user.email,
      "OTP Verification",
      "Secret World OTP Verification code",
      otp
    );

    return new SuccessResponse(messages.success.otpEmailSend, {
      token,
      otp,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for Phone Otp Verification
 */

const forgetPasswordOtpVerify = async (req, res, next) => {
  try {
    let { otp } = req.body;

    otp = Number(otp);

    let user = await service.findOneForAwait(
      User,
      { role: "admin", isDeleted: false },
      {}
    );
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    if (user.otp !== otp) {
      throw new BadRequest(messages.error.inavalidOtp);
    }

    let email = user.email;

    const userDetails = await service.findOneForAwait(
      User,
      { email, isDeleted: false },
      {
        token: 1,
      }
    );

    return new SuccessResponse(messages.success.otpVerify, {
      userDetails,
    }).send(res);
  } catch (error) {
    console.error("Error:", error.message); // Log any errors that occur
    throw new BadRequest(error.message);
  }
};


const resendOtp = async (req, res, next) => {
  try {
    const otp = await commonHelper.generateOTP(4); // Assuming 4-digit OTP for email verification

    await service.findOneAndUpdateForAwait(
      User,
      { _id: req.user._id },
      { otp: otp }
    );

    // send OTP on email
    const user = await User.findOne({ _id: req.user._id });

    await sendEmail.sendEmailOTPFun(
      user.email,
      "OTP Verification",
      "Secret World OTP Verification code",
      otp
    );
    return new SuccessResponse(messages.success.otpEmailSend, { otp }).send(
      res
    );
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function used for set new password
 */

const setNewPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    // Input validation
    if (!password || !confirmPassword || password !== confirmPassword) {
      throw new BadRequest(messages.error.invalidPassword);
    }
    let user = await service.findOneForAwait(User, { role: "admin", _id: req.user._id }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    // Check if the new password is the same as the old password
    const isSameAsOldPassword = await commonHelper.comparePassword(
      password,
      user.password
    );
    if (isSameAsOldPassword) {
      throw new BadRequest(messages.error.sameAsOldPassword);
    }
    // Update the admin password
    const encryptedPassword = await commonHelper.encryptPassword(password);
    await service.findOneAndUpdateForAwait(
      User,
      { role: "admin" },
      { password: encryptedPassword }
    );
    return new SuccessResponse(messages.success.changePassword, {
      userDetails: user,
    }).send(res);
  } catch (error) {
    // Handle errors
    next(error);
  }
};

 /**
 * This Functions is used for add customer address
 */

 const addCustomeraddress = async (req, res, next) => {
  try {
      const { CID, address, longitude, latitude } = req.body;
      // const requiredFields = [CID, address, longitude, latitude];
      // for (const field of requiredFields) {
      //     if (!(field in req.body)) {
      //         return res.status(400).json({ error: `Missing required field: ${field}` });
      //     }
      // }
      const addLocation = new Location({
          CID,
          address,
          location: {
              type: 'Point',
              coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
      });
      await service.createForAwait(addLocation);
      return new SuccessResponse('Address Added Successully',{addLocation}).send(res);
  } catch(error){
      throw new BadRequest(error.message);
  }
};

module.exports = {
  signup,
  emailLogin,
  updateProfile,
  forgotPassword,
  forgetPasswordOtpVerify,
  resendOtp,
  setNewPassword,
  addCustomeraddress

};
