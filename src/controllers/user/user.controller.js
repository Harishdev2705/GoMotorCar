const service = require("../../services/mongodb.services");
const { SuccessResponse,AuthFailureResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { User,Services,UseraddServices,UserCategories,Subservices,Buservices ,UserSubcategories,Openinghours,UserFunctions ,UserFunctions_list,Functions} = require("../../models/index");
const { env } = require("../../utility/config");
const messages = require("../../utility/message");
const { uploadToS3, deleteToS3} = require("../../middlewares/aws-config");
const { ObjectId } = require("bson");
/**
 * This Functions is used for get Profile
 */
const getProfile = async (req, res, next) => {
  try {    
     var userProfile = await User.aggregate([
        {
          $match: { _id:ObjectId(req.user._id) ,usertype:"user",isDeleted:false }
        },
        {
          $lookup: {
            from: "userfunctions",
            localField: "Interests",
            foreignField: "_id",
            as: "userInterests"
          }
        },
        {
          $lookup: {
            from: "userfunctions_lists",
            localField: "userInterests.userfunctionlist_id",
            foreignField: "_id",
            as: "Interests"
          }
        },
        {
          $lookup: {
            from: "userfunctions",
            localField: "Specialization",
            foreignField: "_id",
            as: "userSpecialization"
          }
        },
        {
          $lookup: {
            from: "userfunctions_lists",
            localField: "userSpecialization.userfunctionlist_id",
            foreignField: "_id",
            as: "Specialization"
          }
        },
        {
          $lookup: {
            from: "userfunctions",
            localField: "Dietary",
            foreignField: "_id",
            as: "userDietary"
          }
        },    
        {
          $lookup: {
            from: "userfunctions_lists",
            localField: "userDietary.userfunctionlist_id",
            foreignField: "_id",
            as: "Dietary"
          }
        },    
        {
          $project: {
            'name': 1,
            'mobile': 1,
            'dob': {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$dob'
              }
            },
            'gender': 1,
            // 'userInterests': 1,
            'Interests': 1,
            'userDietary': 1,
            'Dietary': 1,
            // 'userSpecialization': 1,
            // 'Specialization': 1,
            'profile_photo':1,
            'about': 1,
            'place': 1,
            '_id': 1,
          }
        },
      ]); 
    return new SuccessResponse(messages.success.fetchsucess,{userProfile}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * This Functions is used for get user Profile
 */
const getUserProfile = async (req, res, next) => {
  try {    
     var userProfile = await User.aggregate([
        {
          $match: { _id:ObjectId(req.user._id) ,usertype:"user",isDeleted:false }
        },
        {
          $lookup: {
            from: "userfunctions",
            localField: "Interests",
            foreignField: "_id",
            as: "userInterests"
          }
        },
        {
          $lookup: {
            from: "userfunctions_lists",
            localField: "userInterests.userfunctionlist_id",
            foreignField: "_id",
            as: "Interests"
          }
        },
        {
          $lookup: {
            from: "userfunctions",
            localField: "Specialization",
            foreignField: "_id",
            as: "userSpecialization"
          }
        },
        {
          $lookup: {
            from: "userfunctions_lists",
            localField: "userSpecialization.userfunctionlist_id",
            foreignField: "_id",
            as: "Specialization"
          }
        },
        {
          $lookup: {
            from: "userfunctions",
            localField: "Dietary",
            foreignField: "_id",
            as: "userDietary"
          }
        },    
        {
          $lookup: {
            from: "userfunctions_lists",
            localField: "userDietary.userfunctionlist_id",
            foreignField: "_id",
            as: "Dietary"
          }
        },    
        {
          $project: {
            'name': 1,
            'mobile': 1,
            'dob': {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$dob'
              }
            },
            'gender': 1,
            // 'userInterests': 1,
            'Interests': 1,
            'userDietary': 1,
            'Dietary': 1,
            // 'userSpecialization': 1,
            // 'Specialization': 1,
            'profile_photo':1,
            'about': 1,
            'place': 1,
            '_id': 1,
          }
        },
      ]); 
    return new SuccessResponse(messages.success.fetchsucess,{userProfile}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * This Functions is used for update user profile
 */
const updateUserProfile = async (req, res, next) => {
  try {
    let {about,name,dob,gender,interests,deleteInterests,specialization,deleteSpecialization,dietary,deleteDietary} = req.body; 
    if(name == undefined || dob == undefined || gender == undefined || about == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    } 
    // const username = await User.findOne({ _id: req.user._id,type:'user',name:name, isDeleted:false});
    await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{name:name,about:about ,dob:dob,gender:gender}); 

    // if(username){
    //   await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{about:about ,dob:dob,gender:gender});      
    // }else{
    //  const name = await User.findOne({ name:name, isDeleted:false});
    //   if(name){
    //     throw new BadRequest(messages.error.nameUnique);
    //   }
    //   await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{name:name,about:about ,dob:dob,gender:gender}); 
    // }
    console.log('req.body',req.body);   
    const users = await User.findOne({ _id: req.user._id ,usertype:"user", isDeleted:false});
    if(users){     
      if (req.file) {
        if (users.profile_photo) {
          await deleteToS3(users.profile_photo)
        }        
        var profile_photo = req.file;
        var profile_photoimageUrl = await uploadToS3(profile_photo.filename, profile_photo.path);  
        await service.findOneAndUpdateForAwait(User,{ _id: req.user._id },{ profile_photo:profile_photoimageUrl}); 
      } 
      if(interests){
          const interestsArray = JSON.parse(interests);
          if(interestsArray.length > 0){          
            await Promise.all(interestsArray.map(async (row) => {
              console.log('interests',row);
              const functionlist = await UserFunctions_list.findOne({ _id: row.id });
              if(functionlist){
              const userfunction = await UserFunctions.findOne({ userfunctionlist_id: row.id ,user_id:req.user._id});
              console.log('userfunction c',userfunction);
                if(!userfunction){
                  let userfunctio = await new UserFunctions({
                    name: functionlist.name,
                    type:"Interests",
                    userfunctionlist_id:functionlist.id,
                    user_id:req.user._id
                  });  
                  await service.createForAwait(userfunctio);
                  var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Interests: userfunctio._id } }); 
                }else{
                  console.log('userfunction.isDeleted',userfunction.isDeleted);
                  if(userfunction.isDeleted == "true"){
                    const userfunctionupdate = await UserFunctions.findOneAndUpdate({ _id: userfunction.id ,isDeleted:false});
                    var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Interests: userfunction.id } }); 
                  }
                }    
              }       
              }));
          }
      }
      if(deleteInterests){
        const deleteInterestsArray = JSON.parse(deleteInterests);
        if(deleteInterestsArray.length > 0){
          await Promise.all(deleteInterestsArray.map(async (row) => {
            var userfunction = await UserFunctions.findOne({userfunctionlist_id: row.interests_id ,user_id:req.user._id,isDeleted:false});
            console.log(row);
            console.log('userFunctions',userfunction);
              if(userfunction){              
                var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $pull: { Interests: userfunction.id } });
                console.log('userfunction._id',userfunction._id);

                var testuserfunction = await UserFunctions.findOne({userfunctionlist_id:userfunction._id,user_id:req.user._id});
                console.log('testuserfunction',testuserfunction);
              await service.findOneAndUpdateForAwait(UserFunctions,{ userfunctionlist_id: row.interests_id,user_id:req.user._id},{isDeleted:true});

              }            
            }));
        } 
      }  
      if(specialization){
        const specializationArray = JSON.parse(specialization);
        if(specializationArray.length > 0){          
          await Promise.all(specializationArray.map(async (row) => {
            console.log('interests',row);
            const functionlist = await UserFunctions_list.findOne({ _id: row.id });
            if(functionlist){
            const userfunction = await UserFunctions.findOne({ userfunctionlist_id: row.id ,user_id:req.user._id});
            console.log('userfunction c',userfunction);
              if(!userfunction){
                let userfunctio = await new UserFunctions({
                  name: functionlist.name,
                  type:"Specialization",
                  userfunctionlist_id:functionlist.id,
                  user_id:req.user._id
                });  
                await service.createForAwait(userfunctio);
                var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Specialization: userfunctio._id } }); 
              }else{              
                if(userfunction.isDeleted == "true"){
                  const userfunctionupdate = await UserFunctions.findOneAndUpdate({ _id: userfunction.id ,isDeleted:false});
                  var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Specialization: userfunction.id } }); 
                }
              }    
            }       
            }));
        }
      }
      if(deleteSpecialization){
        const deleteSpecializationArray = JSON.parse(deleteSpecialization);
        if(deleteSpecializationArray.length > 0){
          await Promise.all(deleteSpecializationArray.map(async (row) => {
            var userfunction = await UserFunctions.findOne({userfunctionlist_id: row.specialization_id ,user_id:req.user._id,isDeleted:false});
              if(userfunction){              
                var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $pull: { Specialization: userfunction.id } });
                console.log('userfunction._id',userfunction._id);
                var testuserfunction = await UserFunctions.findOne({userfunctionlist_id:userfunction._id,user_id:req.user._id});
                console.log('testuserfunction',testuserfunction);
              await service.findOneAndUpdateForAwait(UserFunctions,{ userfunctionlist_id: row.specialization_id,user_id:req.user._id},{isDeleted:true});

              }            
            }));
        } 
      }     
      if(dietary){
        const dietaryArray = JSON.parse(dietary);
        if(dietaryArray.length > 0){          
          await Promise.all(dietaryArray.map(async (row) => {
            console.log('interests',row);
            const functionlist = await UserFunctions_list.findOne({ _id: row.id });
            if(functionlist){
            const userfunction = await UserFunctions.findOne({ userfunctionlist_id: row.id ,user_id:req.user._id});
            console.log('userfunction c',userfunction);
              if(!userfunction){
                let userfunctio = await new UserFunctions({
                  name: functionlist.name,
                  type:"Dietary",
                  userfunctionlist_id:functionlist.id,
                  user_id:req.user._id
                });  
                await service.createForAwait(userfunctio);
                var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Specialization: userfunctio._id } }); 
              }else{              
                if(userfunction.isDeleted == "true"){
                  const userfunctionupdate = await UserFunctions.findOneAndUpdate({ _id: userfunction.id ,isDeleted:false});
                  var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { Dietary: userfunction.id } }); 
                }
              }    
            }       
            }));
        }
      }
      if(deleteDietary){
      const deleteDietaryArray = JSON.parse(deleteDietary);
        if(deleteDietaryArray.length > 0){
          await Promise.all(deleteDietaryArray.map(async (row) => {
            var userfunction = await UserFunctions.findOne({userfunctionlist_id: row.dietary_id ,user_id:req.user._id,isDeleted:false});
              if(userfunction){              
                var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $pull: { Dietary: userfunction.id } });
                var testuserfunction = await UserFunctions.findOne({userfunctionlist_id:userfunction._id,user_id:req.user._id});
              await service.findOneAndUpdateForAwait(UserFunctions,{ userfunctionlist_id: row.specialization_id,user_id:req.user._id},{isDeleted:true});
              }            
          }));
        } 
      }     
      return new SuccessResponse(messages.success.updateProfile).send(res);
    }else{
      return new AuthFailureResponse(messages.error.inavalidUser).send(res);
    }   
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * This Functions Logout the user
 */

// const userLogout = async (req, res, next) => {
//     try {
//         let user = await service.findOneForAwait(User, { _id: req.user._id }, {});
//         if (!user) {
//             throw new BadRequest(messages.error.noUserFound);
//         }
//         await service.findOneAndUpdateForAwait(User, { _id: req.user._id }, { token: "" });
//         return new SuccessResponse(messages.success.logout).send(res);
//     } catch (error) {
//         throw new BadRequest(error.message)
//     }
// };

/**
 * This Functions edit the user profile pic
 */

const ProfilePictureUpload = async (req, res, next) => {
  try {
    let profileImage = req.file;

    let user = await service.findOneForAwait(User, { _id: req.user._id }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    // Delete the old profile image if it exists
    // if (user.profileImage) {
    //   await deleteToS3(user.profileImage)
    // }

    // Construct the image URL
    const imageUrl = await uploadToS3(profileImage.filename, profileImage.path);
    await service.findOneAndUpdateForAwait(
      User,
      { _id: req.user._id },
      { profileImage: imageUrl }
    );

    let userDetails = await service.findOneForAwait(
      User,
      { _id: req.user._id },
      {}
    );

    return new SuccessResponse(messages.success.updateProfile,{
      userDetails
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * Get user Details through token
 *
 */
const myProfileDetails = async (req, res, next) => {
  try {
    let user = await service.findOneForAwait(
      User,
      { _id: req.user._id },
      {
        name: 1,
        lastname: 1,
        email: 1,
        mobile: 1,
        city: 1,
        dob: 1,
        address: 1,
        about: 1,
        profileImage: 1,
        businessname: 1
      }
    );
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
 * Get user Delete Account through token
 *
 */
const deleteAccount = async (req, res, next) => {
  try {
    let user = await service.findOneForAwait(
      User,
      { _id: req.user._id, isDeleted: false },
      {}
    );
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    await service.findOneAndUpdateForAwait(
      User,
      { _id: req.user._id },
      { isDeleted: true }
    );
    return new SuccessResponse(messages.success.deleteAccount).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * This Functions is used for Change Password
 */

const changePassword = async (req, res, next) => {
  try {
    let { oldPassword, newPassword, confirmPassword } = req.body;
    let user = await service.findOneForAwait(User, { _id: req.user._id }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    if (newPassword != confirmPassword) {
      throw new BadRequest(messages.error.passwordMatch);
    }
    const isMatch = await commonHelper.comparePassword(
      oldPassword,
      user.password
    );
    if (!isMatch) {
      throw new BadRequest(messages.error.invalidPassword);
    }
    await service.findOneAndUpdateForAwait(
      User,
      { _id: req.user._id },
      { password: await commonHelper.encryptPassword(newPassword) }
    );
    return new SuccessResponse(messages.success.changePassword).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * This Functions edit the user profile pic
 */

// const sampleImageUpload = async (req, res, next) => {
//   try {
//     let sampleImages = req.file;

//     let user = await User.findOne({ _id: req.user._id });
//     if (!user) {
//       throw new BadRequest(messages.error.noUserFound);
//     }

//     // Construct the image URL
//     //const imageUrl = await uploadToS3(sampleImages.filename, sampleImages.path);
//     user.sampleImages.push(sampleImages.filename)
//     await user.save();

//     return new SuccessResponse(messages.success.updateProfile).send(res);
//   } catch (error) {
//     throw new BadRequest(error.message);
//   }
// };

// const sampleImageDelete = async (req, res, next) => {
//   try {
//     const imageId = req.params.imageId;

//     const user = await User.findOne({ _id: req.user._id });
//     if (!user) {
//       throw new BadRequest("No user found");
//     }

//     // Find the index of the image in the array
//     const imageIndex = user.sampleImages.findIndex((image) => image.toString() === imageId);
//     if (imageIndex === -1) {
//       throw new BadRequest("Image not found");
//     }

//     // Remove the image from the array
//     user.sampleImages.splice(imageIndex, 1);

//     // Save the updated user object
//     await user.save();

//     return res.json({ success: true, message: "Image deleted successfully" });
//   } catch (error) {
//     next(error);
//   }
// };

/**
 * This Functions is used for update name and email of user
 */

const EditUserProfile = async (req, res, next) => {
  try {
    let { name, lastname } = req.body;
    let profileImage = req.file;

    let user = await service.findOneForAwait(User, { _id: req.user._id }, {});
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    if (!profileImage) {
      await service.findOneAndUpdateForAwait(
        User,
        { _id: req.user._id },
        { name, lastname }
      );
    } else {
      // Delete the old profile image if it exists
      if (user.profileImage) {
        await deleteToS3(user.profileImage)
      }

      // Construct the image URL
      const imageUrl = await uploadToS3(profileImage.filename, profileImage.path);

      await service.findOneAndUpdateForAwait(
        User,
        { _id: req.user._id },
        {
          profileImage: imageUrl,
          name,
          lastname,
        }
      );
    }

    return new SuccessResponse(messages.success.updateProfile).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

const Timinglist = async (req, res, next) => {

  const { userId } = req.params

  try {
    let user = await service.findOneForAwait(
      User,
      { _id: userId },
      {
        name: 1,
        lastname: 1,
        email: 1,
        mobile: 1,
        city: 1,
        dob: 1,
        gender: 1,
        address: 1,
        about: 1,
        profileImage: 1,
        timings: 1
      }
    );
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }
    return new SuccessResponse(messages.success.getMyProfile, { user }).send(
      res
    );
  } catch (error) {
    throw new BadRequest(error.message);
  }
}

const defaultCardAndAddress = async (req, res, next) => {
  try {
    let user = await service.findOneForAwait(
      User,
      { _id: req.user._id, isDeleted: false },
      {}
    );
    if (!user) {
      throw new BadRequest(messages.error.noUserFound);
    }

    const defaultCard = await Cards.findOne({ userId: req.user._id, isDefault: true })
    const defaultAddress = await Address.findOne({ userId: req.user._id, isDefault: true })

    return new SuccessResponse(messages.success.deleteAccount, {
      defaultCard,
      defaultAddress
    }).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

module.exports = {
  getProfile,
  getUserProfile,
  updateUserProfile,
  ProfilePictureUpload,
  myProfileDetails,
  // userLogout,
  deleteAccount,
  changePassword,
  EditUserProfile,
  Timinglist,
  defaultCardAndAddress
};
