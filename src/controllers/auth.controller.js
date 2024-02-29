const service = require("../services/mongodb.services");
const { SuccessResponse ,AuthFailureResponse} = require("../utility/apiResponse");
const { BadRequest } = require("../utility/apiError");
const commonHelper = require("../helper/common");
const { User,Customercars, AdminHelp,VerificationRequests} = require("../models/index");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongoose").Types;
const { env, jwtSecret } = require("../utility/config");
const sendEmail = require("../helper/sendEmail");
const messages = require("../utility/message");
const { SeceretKey } = require("../utility/stripeKey");
const { log, error } = require("winston");
const stripe = require("stripe")(SeceretKey);
const { uploadToS3, deleteToS3,uploadToS3business_id,uploadToS3cover_photo } = require("../middlewares/aws-config");
const { json } = require("express");
/**
 * @description - This function is used for Mobile login/signup
 */
const CustomerSignup = async (req, res, next) => {
  try {
    let {Fullname, mobile,countrycode} = req.body;  
    let newUser = await service.findOneForAwait(
      User,
      { mobile, isDeleted: false },
      { token: 0 }
    );
    let Usercount = await User.find({usertype:"customer",});
    if (!newUser) {
      let user = await new User({
        name:Fullname,
        mobile: mobile,
        countrycode:countrycode,
        usertype:"customer",
        customerSno:'C'+ Number(Usercount.length+1),
        location: {
          type: "Point",
          coordinates: [0, 0],
      },
      });  
      await service.createForAwait(user);
      const { otp, expiryTime } = await commonHelper.generateOtpData({
        userId: user._id,
      });
      // console.log('otp',otp);
      if (user.isBlocked) {
        throw new BadRequest(messages.error.blockUser);
      }  
      await service.findOneAndUpdateForAwait(User,{ mobile },{ loginOtp: otp, loginOtpExpiryTime: expiryTime });   
      const token = await commonHelper.generateToken({
        mobile: mobile,
        role: "user",
        id: user._id,
      });  
      return new SuccessResponse(messages.success.otpSendmobile, {
        token,
        otp: otp,
        // user,
      }).send(res);
    }else{      
      return new SuccessResponse("Already Signup With this Number , Please Login", {       
      }).send(res);
    }   
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for Mobile login
 */
const CustomerLogin = async (req, res, next) => {
  try {
    let { mobile,countrycode} = req.body;  
    let newUser = await service.findOneForAwait(
      User,
      { mobile, isDeleted: false },
      { token: 0 }
    );

    if (newUser) {     
      if (newUser.isBlocked) {
        throw new BadRequest(messages.error.blockUser);
      }  
      const { otp, expiryTime } = await commonHelper.generateOtpData({
        userId: newUser._id,
      });
      await service.findOneAndUpdateForAwait(User,{ mobile },{ loginOtp: otp, loginOtpExpiryTime: expiryTime });   
      const token = await commonHelper.generateToken({
        mobile: mobile,
        role: "user",
        id: newUser._id,
      });  
      return new SuccessResponse(messages.success.otpSendmobile, {
        token,
        otp: otp,
        // user,
      }).send(res);
    }else{
      
      return new SuccessResponse("No Account Found ,Please Signup ", {       
      }).send(res);
    }   
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for resend Otp
 */

const resendOtpmobile = async (req, res, next) => {
  try {
   
    const { otp, expiryTime } = await commonHelper.generateOtpData({
      userId: req.user._id,
    });
    await service.findOneAndUpdateForAwait(
      User,
      { _id: req.user._id },
      { loginOtp: otp, loginOtpExpiryTime: expiryTime }
    );

    // send OTP on email
    // const users = await User.findOne({ _id: req.user._id })
    
    return new SuccessResponse(messages.success.otpSend, { otp:otp }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for create account
 */
const customerAddcar = async (req, res, next) => {  
  try {
    let {RegistrationNo, RegistrationType, BrandID,ModelID,FuelTypeID,TransmissionTypeID,CarCategory } = req.body;
    const user = await User.findOne({ _id: req.user._id ,isDeleted:false});
    let userfunctio = await new Customercars({
      CID: req.user._id,
      RegistrationNo,
      RegistrationType,
      BrandID,
      ModelID,
      FuelTypeID,
      TransmissionTypeID,
      CarCategory
    });  
    await service.createForAwait(userfunctio);
    return new SuccessResponse("Car Sucessfully Added", { userfunctio     
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for Updatecustomercar 
 */
const Updatecustomercar = async (req, res, next) => {  
  try {
    let {carID,RegistrationNo,FuelTypeID} = req.body;
    console.log(req.body);
    const user = await User.findOne({ _id: req.user._id ,isDeleted:false});
    await service.findOneAndUpdateForAwait(Customercars,{ _id:carID},{ FuelTypeID:FuelTypeID ,RegistrationNo:RegistrationNo}); 
    const car = await Customercars.findOne({ _id:carID});    
    return new SuccessResponse("Car Update Sucessfully", { car     
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for Deletecustomercar
 */
const Deletecustomercar = async (req, res, next) => {  
  try {
    let {carID} = req.body;
    const user = await User.findOne({ _id: req.user._id ,isDeleted:false});
    await service.findOneAndUpdateForAwait(Customercars,{ _id:carID},{isDeleted:true}); 
    return new SuccessResponse("Car Deleted Sucessfully").send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for complete account
 */
const usercompleteAccount = async (req, res, next) => {
  try {
    let {about, interests, specialization, dietary,place,lat,long } = req.body; 
    const users = await User.findOne({ _id: req.user._id ,usertype:"user", isDeleted:false});
    //console.log('req.body',req.body);
    if(users){
      if(interests.length > 0){
      await Promise.all(interests.map(async (row) => {
        //console.log('interests',row);
        const functionlist = await UserFunctions_list.findOne({ _id: row.id });
        if(functionlist){
        const userfunction = await UserFunctions.findOne({ userfunctionlist_id: row.id ,user_id:req.user._id, isDeleted:false});
          if(!userfunction){
            let userfunctio = await new UserFunctions({
              name: functionlist.name,
              type:"Interests",
              userfunctionlist_id:functionlist.id,
              user_id:req.user._id
            });  
            await service.createForAwait(userfunctio);
            var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Interests: userfunctio._id } }); 
          }      
        }       
        }));
    }
    if(specialization.length > 0){
      await Promise.all(specialization.map(async (row) => {
        //console.log('specialization');
        const functionlist = await UserFunctions_list.findOne({ _id: row.id });
        if(functionlist){
        const userfunction = await UserFunctions.findOne({ userfunctionlist_id: row.id ,user_id:req.user._id, isDeleted:false});
          if(!userfunction){
            let userfunctio = await new UserFunctions({
              name: functionlist.name,
              type:"Specialization",
              userfunctionlist_id:functionlist.id,
              user_id:req.user._id
            });  
            await service.createForAwait(userfunctio);
            var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Specialization: userfunctio._id } }); 
          }      
        }       
        }));
    }
    if(dietary.length > 0){
      await Promise.all(dietary.map(async (row) => {
        //console.log('dietary');
        const functionlist = await UserFunctions_list.findOne({ _id: row.id });
        if(functionlist){
        const userfunction = await UserFunctions.findOne({ userfunctionlist_id: row.id ,user_id:req.user._id, isDeleted:false});
          if(!userfunction){
            let userfunctios = await new UserFunctions({
              name: functionlist.name,
              type:"Dietary",
              userfunctionlist_id:functionlist.id,
              user_id:req.user._id
            });  
            await service.createForAwait(userfunctios);
            var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{ $push: { Dietary: userfunctios._id } }); 
          }      
        }       
        }));
    }   
    await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{ about:about ,latitude:lat,longitude:long,location: {type: "Point",coordinates: [lat, long]},place:place,profile_status:3}); 
    const usersres = await User.findOne({ _id: req.user._id });
    return new SuccessResponse(messages.success.updateUser, {
      user: usersres
    }).send(res);
    }else{
      return new AuthFailureResponse(messages.error.inavalidUser).send(res);
    }  
    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for distance calcualtion
 */
const distance = async(userlocation,name)=>{
  console.log('name',name);
  // const users = await User.findOne({ _id: req.user._id ,usertype:"b_user", isDeleted:false});
  const userLocation = {
    type: 'Point',
    coordinates: [30.742938, 76.647629]
  };
  const nearbyBusinesses = await User.find({
    usertype:"b_user", isDeleted:false,
    location: {
      $near: {
        $geometry: userLocation,
        $maxDistance: 5 * 1000 // Convert km to meters
      }
    }
  });
 
  await Promise.all(nearbyBusinesses.map(async (row) => {
    if(row.businessname === name){
      console.log('if');
      var data = 1;
      return false
    }else{
      console.log('ifss');

      var data = 0;
      return true
    }
    // const openingtime = await Openinghours.findOne({day: row.day ,user_id :req.user._id });
   
  }));
  // if()

  //console.log('nearbyBusinesses',nearbyBusinesses);
  //var data = 'text';
//return data
};
/**
 * @description - This function is used for business user complete account
 */

const b_usercompleteAccount = async (req, res, next) => {
  try {
    let {about, businessname,services, place,lat,long ,openinghours} = req.body; 
    //--------find businessname exist on other account
    const userLocation = {
      type: 'Point',
      coordinates: [parseFloat(lat),parseFloat(long)]
    };
    const nearbyBusinesses = await User.find({
      usertype:"b_user", isDeleted:false,
      location: {
        $near: {
          $geometry: userLocation,
          $maxDistance: 5 * 1000 // Convert km to meters
        }
      }
    });   
    // console.log('nearbyBusinesses',nearbyBusinesses);
    await Promise.all(nearbyBusinesses.map(async (row) => {
      if(row.businessname === businessname){
         throw new BadRequest(messages.error.nameUnique);
      }
    }));
    const openingHoursArray = JSON.parse(openinghours);
    const servicesArray = JSON.parse(services);
    const users = await User.findOne({  _id: req.user._id ,usertype:"b_user", isDeleted:false});
    if(users){      
      if (req.files && req.files['business_id'] && req.files['business_id'][0]) {
        var business_id = req.files['business_id'][0];
        var business_idimageUrl = await uploadToS3business_id(business_id.filename, business_id.path);        
        // console.log('business_id file exists:', req.files['business_id'][0]);
      } else {
        var business_idimageUrl = '';
          // console.log('business_id file does not exist');
      }  
      // Check if 'cover_photo' exists in req.files and has at least one file
      if (req.files && req.files['cover_photo'] && req.files['cover_photo'][0]) {
        var cover_photo = req.files['cover_photo'][0];
        var cover_photoimageUrl = await uploadToS3cover_photo(cover_photo.filename, cover_photo.path);

      } else {
          console.log('cover_photo file does not exist');
          var cover_photoimageUrl = "";
      }    
      if(about == undefined || businessname == undefined || place == undefined || lat == undefined || long == undefined){
        return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
      }      
      if(openingHoursArray.length > 0){
        await Promise.all(openingHoursArray.map(async (row) => {
          console.log('interests',row);
          const openingtime = await Openinghours.findOne({day: row.day ,user_id :req.user._id });
          
        var fromtime = '0000-01-01T' + row.starttime + ':00.000Z';
        var totime = '0000-01-01T' + row.endtime + ':00.000Z';
        console.log(fromtime);
        console.log(totime);
          if(!openingtime){                          
            let hours = await new Openinghours({
              day: row.day,
              starttime:row.starttime,
              starttimef:fromtime,
              endtimef:totime,
              endtime:row.endtime,
              user_id:req.user._id
            });  
            await service.createForAwait(hours);
            var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { opening_hours: hours._id } });              
          }else{
              var updateuser = await service.findOneAndUpdateForAwait(Openinghours,{ day: row.day ,user_id :req.user._id},{ status:row.status ,starttime:row.starttime,endtime:row.endtime,starttimef:fromtime,endtimef:totime}); 
          }       
        }));
      }     
      if(servicesArray.length > 0){
        await Promise.all(servicesArray.map(async (row) => {
          const services = await Services.findOne({_id: row.id });
          const userservice = await UseraddServices.findOne({service_id: row.id ,user_id:req.user._id});
          if(services){
            if(!userservice){
              let userbuniss = await new UseraddServices({
                categoryName: services.name,
                service_id:services.id,
                user_id:req.user._id
              });  
              await service.createForAwait(userbuniss);
              console.log('userbuniss',userbuniss);
              var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { services: userbuniss._id } });
            }               
          }               
          }));
      } 
      // await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{ about:about ,latitude:lat,longitude:long,place:place}); 
      //------find neary user business name
      const userLocation = {
        type: 'Point',
        coordinates: [lat, long]
      };
      var distanceresult = distance(userLocation , businessname);
      var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{ about: about, businessname:businessname ,place:place,latitude:lat, longitude:long,location: {type: "Point",coordinates: [lat, long]},business_id:business_idimageUrl, cover_photo:cover_photoimageUrl,profile_status:3});
      const usersres = await User.findOne({ _id: req.user._id });
      return new SuccessResponse(messages.success.updateUser, {
        user: usersres
      }).send(res);
    }else{
      return new AuthFailureResponse(messages.error.inavalidUser).send(res);
    }
    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

const otpVerificationmobile = async (req, res, next) => {
  try {
    const {otp } = req.body;
    const user = await User.findOne({ _id: req.user._id })
    console.log('users',user);
    // var userphone = users.mobile
    // const user = await service.findOneForAwait(User, { userphone, isDeleted: false }, {});

    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    if (user.loginOtp !== otp) {
      throw new BadRequest(messages.error.inavalidOtp);
    }

    const currentTime = Date.now();
    if (user.loginOtpExpiryTime < currentTime) {
      throw new BadRequest(messages.error.optExpired);
    }
    const userprofile_status = await User.findOne({ _id: req.user._id });
    if(userprofile_status.profile_status == 0){
      var profile_status = 1;
    }else{
      var profile_status = userprofile_status.profile_status;

    }
    // Perform additional actions if the OTP is valid, e.g., update user's verification status, log them in, etc.
    await service.findOneAndUpdateForAwait(
      User,
      { _id: user.id},
      {loginOtp:'', isMobileVerified: true ,profile_status:profile_status}
    );    
    const updateuser = await User.findOne({ _id: req.user._id });
    return new SuccessResponse(messages.success.otpVerified, {
      user:updateuser,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

const otpVerification = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    const user = await service.findOneForAwait(User, { email, isDeleted: false }, {});

    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    if (user.loginOtp !== otp) {
      throw new BadRequest(messages.error.inavalidOtp);
    }

    const currentTime = Date.now();
    if (user.loginOtpExpiryTime < currentTime) {
      throw new BadRequest(messages.error.optExpired);
    }

    // Perform additional actions if the OTP is valid, e.g., update user's verification status, log them in, etc.
    await service.findOneAndUpdateForAwait(
      User,
      { email: email },
      { isMobileVerified: true }
    );

    const token = await commonHelper.generateToken({
      email,
      role: user.role,
      id: user._id,
    });

    const userDetails = await service.findOneForAwait(User, { email, isDeleted: false }, {});

    return new SuccessResponse(messages.success.otpVerified, {
      token,
      user:userDetails,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const VerificationRequest = async (req, res, next) => {
  try {
    const user = await service.findOneForAwait(User, { _id:req.user._id , isDeleted: false }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    const userreq = await service.findOneForAwait(VerificationRequests, { user_id:req.user._id }, {});
    if(userreq){
      await service.findOneAndUpdateForAwait(
        VerificationRequests,
        { user_id:req.user._id },{ $inc: { requestCount: 1 } }
      );
    }else{
      let veryrequest = await new VerificationRequests({      
        user_id:req.user._id,
        usertype:user.usertype
      });  
      await service.createForAwait(veryrequest);
    }
    return new SuccessResponse(messages.success.RequestCreateSucess).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const VerificationStatus = async (req, res, next) => {
  try {
    const user = await service.findOneForAwait(User, { _id:req.user._id , isDeleted: false }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    const userreq = await service.findOneForAwait(VerificationRequests, { user_id:req.user._id }, {});
    if(userreq){
      if(userreq.isVerified == 'true'){
        return new SuccessResponse("You are Verified").send(res);
      }else{
        return new SuccessResponse("You are not Verified").send(res);
      }
    }
    return new SuccessResponse("You are not Verified").send(res);
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

    email = email.toLowerCase();

    let user = await service.findOneForAwait(
      User,
      { email, isDeleted: false },
      { token: 0 }
    );

    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    if (user.isBlocked) {
      throw new BadRequest(messages.error.blockUser);
    }

    if (user.isMobileVerified == false) {
      const { otp, expiryTime } = await commonHelper.generateOtpData({
        userId: user._id,
      });
      const token = await commonHelper.generateToken({
        email: email,
        role: user.role,
        id: user._id,
      });
      await service.findOneAndUpdateForAwait(User,{ email },{ loginOtp: otp, loginOtpExpiryTime: expiryTime });
      return new SuccessResponse(messages.success.otpSend, {
        token,
        otp,
        user,
      }).send(res);
    }

    const isMatch = await commonHelper.comparePassword(password, user.password);
    if (!isMatch) {
      throw new BadRequest(messages.error.invalidPassword);
    }

    const token = await commonHelper.generateToken({
      email: email,
      role: user.role,
      id: user._id,
    });

    if(!user.customerID){
      // stripe customer id create
      const customer = await stripe.customers.create({
        email: email,
        name: user.name + ' ' + user.lastname
      })
      await service.findOneAndUpdateForAwait(
        User,
        { email },
        { customerID: customer.id }
      );
    }

    await service.findOneAndUpdateForAwait(
      User,
      { email },
      { token: token, fcmToken: fcmToken }
    );

    return new SuccessResponse(messages.success.login, {
      token,
      otp: null,
      user,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};


/**
 * @description - This function is used for social login
 */
const socialLogin = async (req, res, next) => {
  try {
    let { socialId, name, lastname, profileImage, socialType, email, role } = req.body;
    //check login email address
    let user = await service.findOneForAwait(
      User,
      { email, isDeleted: false },
      {}
    );
    if (user) {

      // generate token
      const token = await commonHelper.generateToken({
        socialId,
        email,
        role: user.role,
        id: user._id,
      });

      // stripe customer id create
      if(!user.customerID){
        customer = await stripe.customers.create({
          email: email,
          name: user.name + ' ' + user.lastname
        })
        await service.findOneAndUpdateForAwait(
          User,
          { email },
          {
            customerID: customer.id
          }
        );
      }

      await service.findOneAndUpdateForAwait(
        User,
        { email },
        {
          // role:role,
          socialType: socialType,
          token: token,
          failedLoginAttempts: 0,
          fcmToken: req.body.fcmToken || ""
        }
      );

      user = await service.findOneForAwait(
        User,
        { email, isDeleted: false },
        {}
      );

      return new SuccessResponse(messages.success.login, {
        token,
        user,
      }).send(res);
    } else {

      // stripe customer id create
      const customer = await stripe.customers.create({
        email: email,
        name: user.name + ' ' + user.lastname
      })

      let newUser = await new User({
        name,
        lastname, 
        profileImage,
        role,
        isMobileVerified: true,
        email,
        socialType,
        socialId,
        fcmToken: req.body.fcmToken,
        customerID: customer.id
      });
      await service.createForAwait(newUser);
      // generate token
      const token = await commonHelper.generateToken({
        socialId,
        email,
        role,
        id: newUser._id,
      });

      await service.findOneAndUpdateForAwait(
        User,
        { email },
        { token: token }
      );

      let user = await service.findOneForAwait(
        User,
        { email, isDeleted: false },
        {}
      );
      return new SuccessResponse(messages.success.login, {
        token,
        user,
      }).send(res);
    }
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for resend Otp
 */

const resendOtp = async (req, res, next) => {
  try {
    const { otp, expiryTime } = await commonHelper.generateOtpData({
      userId: req.user._id,
    });
    await service.findOneAndUpdateForAwait(
      User,
      { _id: req.user._id },
      { loginOtp: otp, loginOtpExpiryTime: expiryTime }
    );

    // send OTP on email
    const user = await User.findOne({ _id: req.user._id })

    await sendEmail.sendEmailFun(user.email, "OTP Verification", "Secret World OTP Verification code", otp)

    return new SuccessResponse(messages.success.otpSend, { otp }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for forgot Password
 */

const forgotPassword = async (req, res, next) => {
  try {
    let { email } = req.body;
    email = email.toLowerCase()

    let user = await service.findOneForAwait(User, { email, isDeleted: false }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    // token generate
    const token = await commonHelper.generateToken({
      email,
      role: user.role,
      id: user._id,
    });

    // generate otp
    const { otp, expiryTime } = await commonHelper.generateOtpData({
      userId: user._id,
    });

    await service.findOneAndUpdateForAwait(
      User,
      { email },
      { token: token, loginOtp: otp, loginOtpExpiryTime: expiryTime }
    );

    await sendEmail.sendEmailFun(user.email, "OTP Verification", "Secret World OTP Verification code", otp)

    return new SuccessResponse(messages.success.otpEmailSend, {
      token,
      otp,
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function used for set new password
 */

const setNewPassword = async (req, res, next) => {
  const { password, token } = req.body;
  const decode = jwt.verify(token, jwtSecret);
  let user = await service.findOneForAwait(
    User,
    { _id: decode.id, role: decode.role },
    {}
  );
  if (!user) {
    throw new BadRequest(messages.error.noUserFound);
  }
  await service.findOneAndUpdateForAwait(
    User,
    { _id: decode.id },
    { password: await commonHelper.encryptPassword(password) }
  );
  return new SuccessResponse(messages.success.changePassword,{
    userDetails: user
  }).send(res);
};

/**
 * This Functions is used for update Business profile
 */

const updateRole = async (req, res, next) => {
  try {
    let {
      userId,
      role
    } = req.body;
    let user = await service.findOneForAwait(User, { _id: userId }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    await service.findOneAndUpdateForAwait(
      User,
      { _id: userId },
      {
        role
      }
    );

    let userDetails = await service.findOneForAwait(
      User,
      { _id: userId },
      {}
    );

    const token = await commonHelper.generateToken({
      email: userDetails.email,
      role: userDetails.role,
      id: userDetails._id,
    });

    return new SuccessResponse(messages.success.updateRole, {
      user:userDetails,
      token
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};


/**
 * @description - This function is used for user admin Help Center
 */
const adminHelpCenter = async (req, res, next) => {
  try {
    let {name, email, message, type } = req.body;

    let addHelp = await new AdminHelp({
      name: name,
      email: email.toLowerCase(),
      message,
      type,
    });
    await service.createForAwait(addHelp);


    await sendEmail.sendEmailHelpFun("Adminlsj@shoponestop.net", "Secret World Help Request", "Secret World Help", name, email, message, type)


    return new SuccessResponse(messages.success.sendHelpMessage,{
      addHelp: addHelp
    }).send(res);

  } catch (error) {
    throw new BadRequest(error.message);
  }
};


module.exports = {  
  otpVerification,
  CustomerSignup,
  CustomerLogin,
  otpVerificationmobile,
  resendOtpmobile,
  customerAddcar,
  Updatecustomercar,
  Deletecustomercar,
};
