const service = require("../../services/mongodb.services");
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { User } = require("../../models/index");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { env, jwtSecret } = require("../../utility/config");
const { sendEmail } = require("../../helper/sendEmail");
const messages = require("../../utility/message");
const { uploadToS3, deleteToS3 } = require("../../middlewares/aws-config");



/**
 * Get Admin Details through id
 *
 */
const myProfile = async (req, res, next) => {
    try {
        let user = await service.findOneForAwait(User, { _id: req.user._id }, {});
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }
        return new SuccessResponse(messages.success.getMyProfile, { user }).send(res);
    } catch (error) {
        throw new BadRequest(error.message)
    }
};


/**
 * This Functions is used for update Admin profile image
 */

  const profileImageUpload = async (req, res, next) => {
    try {
      const profileImage = req.file;
      const user = await service.findOneForAwait(User, { _id: req.user._id }, {});
      if (!user) {
        throw new BadRequest(messages.error.noUserFound);
      }

      // Delete the old profile image if it exists
      if (user.profileImage) {
        await deleteToS3(user.profileImage);
      }

      // Construct the image URL
      const imageUrl = await uploadToS3(profileImage.filename, profileImage.path);

      // Update the user document with the new image URL
      await service.findOneAndUpdateForAwait(User, { _id: req.user._id }, { profileImage: imageUrl });

      return new SuccessResponse(messages.success.updateProfileImage).send(res);
    } catch (error) {
      throw new BadRequest(error.message);
    }
  };


/**
 * This Functions is used for update Admin profile
 */

const updateProfile = async (req, res, next) => {
    try {
        let { name  } = req.body
        let user = await service.findOneForAwait(User, { _id: req.user._id }, {});
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }
        await service.findOneAndUpdateForAwait(User, { _id: req.user._id }, { name });
        return new SuccessResponse(messages.success.updateProfile).send(res);
    } catch (error) {
        throw new BadRequest(error.message)
    }
};

/**
 * This Functions is used for Change Password
 */

const changePassword = async (req, res, next) => {
    try {
        let { oldPassword, newPassword, confirmPassword } = req.body
        let user = await service.findOneForAwait(User, { _id: req.user._id  }, {});
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }
        if(newPassword != confirmPassword){
            throw new BadRequest(messages.error.passwordMatch);
        }
        const isMatch = await commonHelper.comparePassword(oldPassword, user.password);
        if (!isMatch) {
        throw new BadRequest(messages.error.invalidOldPassword);
        }
        await service.findOneAndUpdateForAwait(User, { _id: req.user._id }, { password: await commonHelper.encryptPassword(newPassword) });
        return new SuccessResponse(messages.success.changePassword).send(res);
    } catch (error) {
        throw new BadRequest(error.message)
    }
};

module.exports = {
    myProfile,
    profileImageUpload,
    updateProfile,
    changePassword
}