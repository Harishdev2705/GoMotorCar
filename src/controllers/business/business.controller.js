const service = require("../../services/mongodb.services");
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { SeceretKey } = require("../../utility/stripeKey");
const {
  User,
  Appointment,
  Transaction,
  Client,
  Notification,
} = require("../../models/index");
const messages = require("../../utility/message");
const sendNotification = require("../../utility/sendNotification");
const stripe = require("stripe")(SeceretKey);

/**
 * @description - This function used for business Signup
 */

const businessSignup = async (req, res, next) => {
  try {
    let { firstname, lastname, email, password, countryId, mobile, fcmToken } =
      req.body;

    let checkDelete = await service.findOneForAwait(
      User,
      { email, isDeleted: true },
      {}
    );
    if (checkDelete) {
      let newUser = await new User({
        name: firstname,
        lastname,
        role: "business",
        email,
        password: await commonHelper.encryptPassword(password),
        countryId,
        mobile,
        fcmToken,
      });

      await service.createForAwait(newUser);
      const token = await commonHelper.generateToken({
        email,
        role: "business",
        id: newUser._id,
      });

      const { otp, expiryTime } = await commonHelper.generateOtpData({
        userId: newUser._id,
      });

      await service.findOneAndUpdateForAwait(
        User,
        { email },
        { token: token, loginOtp: otp, loginOtpExpiryTime: expiryTime }
      );

      return new SuccessResponse(messages.success.BusinessSignup, {
        token,
        otp,
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
        name: firstname,
        lastname,
        role: "business",
        email,
        password: await commonHelper.encryptPassword(password),
        countryId,
        mobile,
        fcmToken,
      });

      await service.createForAwait(newUser);
      const token = await commonHelper.generateToken({
        email,
        role: "business",
        id: newUser._id,
      });

      const { otp, expiryTime } = await commonHelper.generateOtpData({
        userId: newUser._id,
      });

      await service.findOneAndUpdateForAwait(
        User,
        { email },
        { token: token, loginOtp: otp, loginOtpExpiryTime: expiryTime }
      );

      return new SuccessResponse(messages.success.BusinessSignup, {
        token,
        otp,
        user: newUser,
      }).send(res);
    }
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * Get Business Details through id
 *
 */
const signUpMoreInfo = async (req, res, next) => {
  try {
    let user = await service.findOneForAwait(User, { _id: req.user._id }, {});

    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    return new SuccessResponse(messages.success.getMyProfile, { user }).send(
      res
    );
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for get card list
 */
const getUserContact = async (req, res, next) => {
  try {
    // query meter details
    let skip = req.query.offset || 0;
    let limit = req.query.limit || 200;

    // check card details
    let userlist = await service.findManyForAwaitWithSortSkipAndLimit(
      Client,
      { isDeleted: false },
      {},
      { createdAt: -1 },
      skip,
      limit
    );
    if (!userlist) {
      throw new BadRequest(messages.error.noUserFound);
    }

    return new SuccessResponse(messages.success.userList, {
      userlist,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for get card list
 */
const getUserContactByBusinessID = async (req, res, next) => {
  try {
    // query meter details
    let skip = req.query.offset || 0;
    let limit = req.query.limit || 100;

    // check card details
    let userlist = await service.findManyForAwaitWithSortSkipAndLimit(
      Client,
      { businessID: req.user._id, isDeleted: false },
      {},
      { createdAt: -1 },
      skip,
      limit
    );
    if (!userlist) {
      throw new BadRequest(messages.error.noUserFound);
    }

    return new SuccessResponse(messages.success.userList, {
      userlist,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

const CreateUserContact = async (req, res, next) => {
  try {
    let { name, email, mobile, address, city, state, zip, dob } = req.body;

    // check card details
    // let checkUserBusiness = await User.findOne({ _id: req.user._id });
    // if (checkUserBusiness) {
    //   throw new BadRequest(messages.error.BusinessFound);
    // }

    // check card details
    let checkUser = await Client.findOne({
      email: email,
      businessID: req.user._id,
    });
    if (checkUser) {
      await Client.updateOne(
        { email: email, businessID: req.user._id },
        {
          name: name,
          mobile: mobile,
          address: address,
          city: city,
          state: state,
          zip: zip,
          dob: dob,
        }
      );

      return new SuccessResponse(messages.success.updateUser).send(res);
    } else {
      await Client.create({
        name: name,
        email: email,
        mobile: mobile,
        address: address,
        city: city,
        state: state,
        zip: zip,
        dob: dob,
        businessID: req.user._id,
      });

      return new SuccessResponse(messages.success.createUser).send(res);
    }
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for add Appointment
 */
const createNewAppointment = async (req, res, next) => {
  try {
    const { data } = req.body;
    let userIdNew = data[0].userId;
    let serviceTypeCheck = data[0].serviceType;
    let transactionObj = {
      userId: userIdNew,
      transactionFor: "service",
      description: "Purchased new service",
      paymentMethod: "card",
    };

    var transcationAdd = await Transaction.create(transactionObj);


    if(serviceTypeCheck == 3){
      for (let i = 0; i < data.length; i++) {
        let appointmentData = data[i];
        var {
          serviceId,
          userId,
          date,
          time,
          timeDuration,
          notes,
          title,
          serviceType,
          totalAmount,
        } = appointmentData;
  
        // add appointment details
        await Appointment.create({
          userId: userId,
          businessId: req.user._id,
          transactionId: transcationAdd._id,
          date,
          time,
          timeDuration,
          serviceId,
          notes,
          isStatus: 2,
          paymentMethod: "card",
          title,
          serviceType,
        });
      }
    }else if(serviceTypeCheck == 2){
      for (let i = 0; i < data.length; i++) {
        let appointmentData = data[i];
        var {
          userId,
          serviceId,
          date,
          time,
          timeDuration,
          notes,
          title,
          serviceType,
        } = appointmentData;
  
        // add appointments details-
        await Appointment.create({
          userId: userId,
          businessId: req.user._id,
          transactionId: transcationAdd._id,
          date,
          time,
          timeDuration,
          serviceId: "6593df6c4834086d8276b736",
          notes,
          isStatus: 2,
          paymentMethod: "card",
          title,
          serviceType,
        });
      }
    }
  

    let userData = await User.findOne({ _id: userIdNew });

    if(userData == null){
      userData = await Client.findOne({ _id: data[0].userId });
      userData.profileImage = 'https://sosapiimages.s3.us-east-2.amazonaws.com/1690621238709IMG-20230729-WA0017.jpg';
    }

    const defaultImageURL = 'https://sosapiimages.s3.us-east-2.amazonaws.com/1690621238709IMG-20230729-WA0017.jpg';
    const productImages = userData.profileImage ? [userData.profileImage] : [defaultImageURL];

    const unitAmount = Math.round((totalAmount * 100) / data.length);

    let sessionUrl;
     
    if(serviceTypeCheck == 3){
      const session = await stripe.checkout.sessions.create({ 
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Services", // Replace with the actual product name
                images: productImages,
              },
              unit_amount: unitAmount, // Convert to the lowest currency unit (e.g., cents)
            },
            quantity: data.length,
          },
        ],
        metadata: {
          transId: transcationAdd._id.toString(),
          type: "service",
        },
        mode: "payment",
        success_url:
          "https://www.shoponestop.net/payment-Successful/appointments",
        cancel_url: "https://www.shoponestop.net/payment-failed",
      });

      sessionUrl =  session.url;

      let userFcm = await User.findOne({ _id: userId });

      if (userFcm) {
        let type = {
          NotificationType: "Appointment Booking ",
        };
        await sendNotification(
          userFcm.fcmToken,
          "Payment For services you have taken",
          session.url,
          productImages,
          type
        );
  
        await Notification.create({
          userId: userFcm._id,
          businessId: userId,
          serviceId: serviceId || null,
          productId: null,
          message: "Appointment Add by provider",
          status: "service",
        });
      }

    }else{
      sessionUrl = "";
    }

    return new SuccessResponse(messages.success.appointmentSubmit, {
      paymentLink: sessionUrl,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

// const createNewAppointment = async (req, res, next) => {
//   try {
//     const appointmentsData = req.body.data;

//     const appointments = await Promise.all(appointmentsData.map(async appointmentData => {
//       const {
//         serviceId,
//         userId,
//         date,
//         time,
//         timeDuration,
//         notes,
//         title,
//         serviceType
//       } = appointmentData;

//       // Rest of the code remains the same

//       let transactionObj = {
//         userId: userId,
//         transactionFor: "service",
//         description: "Purchased new service",
//         paymentMethod: "cash",
//       };

//       let transcationAdd = await Transaction.create(transactionObj);

//       let newAppointment = await Appointment.create({
//         userId: userId,
//         businessId: req.user._id,
//         transactionId: transcationAdd._id,
//         date,
//         time,
//         timeDuration,
//         serviceId,
//         notes,
//         isStatus: 2,
//         paymentMethod: "cash",
//         title,
//         serviceType
//       });

//       return {
//         serviceId,
//         userId,
//         date,
//         time,
//         timeDuration,
//         notes,
//         title,
//         serviceType
//       };
//     }));

//     return new SuccessResponse(messages.success.appointmentSubmit, { appointments }).send(res);
//   } catch (error) {
//     throw new BadRequest(error.message);
//   }
// };

/**
 * @description - This function is used for get card list
 */
const getUserContactSearch = async (req, res, next) => {
  try {
    // query meter details
    let skip = req.query.offset || 0;
    let limit = req.query.limit || 200;
    let nameAndPhone = req.query.nameAndPhone;

    // Build the search criteria
    const searchCriteria = {
      isDeleted: false,
      businessID: req.user._id,
    };

    if (nameAndPhone) {
      // If a name or phone number is provided, add it to the search criteria
      searchCriteria.$or = [
        { name: { $regex: nameAndPhone, $options: "i" } }, // Case-insensitive name search
        { mobile: { $regex: nameAndPhone, $options: "i" } }, // Case-insensitive phone search
      ];
    }

    // check card details
    let userlist = await service.findManyForAwaitWithSortSkipAndLimit(
      Client,
      searchCriteria,
      {},
      { createdAt: -1 },
      skip,
      limit
    );
    if (!userlist) {
      throw new BadRequest(messages.error.noUserFound);
    }

    return new SuccessResponse(messages.success.userList, {
      userlist,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for get card list
 */
const getUserContactDetails = async (req, res, next) => {
  try {
    let { id } = req.params;
    // check card details
    let checkUser = await service.findOneForAwait(
      Client,
      { isDeleted: false, _id: id },
      {},
      {}
    );
    if (!checkUser) {
      throw new BadRequest(messages.error.noUserFound);
    }

    return new SuccessResponse(messages.success.userDetail, {
      userdetails: checkUser,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for delete Product
 */
const deleteContactUser = async (req, res, next) => {
  try {
    let { id } = req.params;

    let checkBankDetails = await service.findOneForAwait(
      Client,
      { _id: id, isDeleted: false },
      {}
    );
    if (!checkBankDetails) throw new BadRequest(messages.error.noUserFound);

    await Client.deleteOne({ _id: id });

    return new SuccessResponse(messages.success.userDeleted).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

module.exports = {
  businessSignup,
  signUpMoreInfo,
  getUserContact,
  CreateUserContact,
  getUserContactByBusinessID,
  createNewAppointment,
  getUserContactSearch,
  getUserContactDetails,
  deleteContactUser,
};
