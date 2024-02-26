const service = require("../../services/mongodb.services");
const { SuccessResponse,AuthFailureResponse ,NotFoundResponse} = require("../../utility/apiResponse");
const { BadRequest ,NotFound} = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { User,Services,UseraddServices,UserCategories,Subservices,Buservices ,UserSubcategories,Openinghours} = require("../../models/index");
const { env } = require("../../utility/config");
const messages = require("../../utility/message");
const { uploadToS3, deleteToS3,deleteToS3coverphotos,uploadToS3cover_photo} = require("../../middlewares/aws-config");
const { ObjectId } = require("bson");
const { trusted } = require("mongoose");

/**
 * This Functions is used for get Profile
 */
const getProfile = async (req, res, next) => {
  try {    
     var userProfile = await User.aggregate([
        {
          $match: { _id:ObjectId(req.user._id) ,usertype:"b_user",isDeleted:false }
        },
        {
          $lookup: {
            from: "userservices",
            localField: "services",
            foreignField: "_id",
            as: "userServices"
          }
        },
        {
          $lookup: {
            from: "services",
            localField: "userServices.service_id",
            foreignField: "_id",
            as: "Services"
          }
        },  
        {
          $lookup: {
            from: "openinghours",
            localField: "opening_hours",
            foreignField: "_id",
            as: "opening_hours"
          }
        },    
        {
          $lookup: {
            from: "buserservices",
            let: { user_id: "$_id" },
            pipeline: [
              {                
                $match: {
                  $expr: { $and:[{ $eq: ["$user_id", "$$user_id"] }, { $eq: ["$isDeleted", false] }] }
                }
              },
              {
                $group: {
                  _id: "$user_id",
                  totalServices: { $sum: 1 }
                }
              }
            ],
            as: "userServicesCount"
          }
        },
        {
          $project: {
            'businessname':1,
            'name': 1,
            'mobile': 1,
            'dob': {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$dob'
              }
            },
            'gender': 1,
            'profile_photo':1,
            'cover_photo': 1,
            'about': 1,
            'place': 1,
            'Services':1,
            'userServicesCount':1,
            '_id': 1,
          }
        },
      ]); 
      const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
      const hours = await Openinghours.aggregate([
        {
          $match: {
            user_id: req.user._id,
            isDeleted: false
          }
        },       
        
        {
          $project: {
            'day': 1,
            'isDeleted': 1,
            'starttime': { $substr: ['$starttimef', 11, 5] }, // Extract time from starttimef
            'endtime': { $substr: ['$endtimef', 11, 5] },     // Extract time from endtimef        
            '_id': 1
          }
        }, 
      ]); 
      const fullWeekData = daysOfWeek.map((day) => {
        const openingHours = hours.find((oh) => oh && oh.day && oh.day.toLowerCase() === day.toLowerCase()  && 
        oh.isDeleted == false );
        console.log(openingHours);
        if (openingHours) {
          return {
            day: day,
            starttime: openingHours.starttime,
            endtime: openingHours.endtime,
            isOpen: 'open',
          };
        } else {
          return {
            day: day,
            isOpen: 'closed',
          };
        }
      });
    return new SuccessResponse(messages.success.fetchsucess,{userProfile,opening_hours:fullWeekData}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * This Functions is used for get Bsiness user Profile
 */
const getBuserProfile = async (req, res, next) => {
  try {    
     var userProfile = await User.aggregate([
        {
          $match: { _id:ObjectId(req.user._id) ,usertype:"b_user",isDeleted:false }
        },
        {
          $lookup: {
            from: "userservices",
            localField: "services",
            foreignField: "_id",
            as: "userServices"
          }
        },
        {
          $lookup: {
            from: "services",
            localField: "userServices.service_id",
            foreignField: "_id",
            as: "Services"
          }
        },  
        {
          $lookup: {
            from: "openinghours",
            localField: "opening_hours",
            foreignField: "_id",
            as: "opening_hours"
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
            'profile_photo':1,
            'cover_photo': 1,
            'about': 1,
            'place': 1,
            'Services':1,
            'opening_hours':{
              $map: {
                input: '$opening_hours',
                as: 'oh',
                in: {
                  '_id':  '$$oh._id',
                  'day':  '$$oh.day',
                  'starttime':  { $substr: ['$$oh.starttimef', 11, 5] },
                  'endtime':  { $substr: ['$$oh.endtimef', 11, 5] },                   
                }
              },
            },
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
 * This Functions is used for update name and email of user
 */
const updateBuserProfile = async (req, res, next) => {
  try {
    let {about,name,dob,gender,services,deleteServices,openinghours,deleteopeningHours} = req.body; 
    if(name == undefined || dob == undefined || gender == undefined || about == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }     
    // const username = await User.findOne({ _id: req.user._id,type:'b_user',name:name, isDeleted:false});
    await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{name:name, about:about ,dob:dob,gender:gender});      

    // if(username){
    //   await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{about:about ,dob:dob,gender:gender});       
    // }else{
    //  const name = await User.findOne({ name:name, isDeleted:false});
    //   if(name){
    //     throw new BadRequest(messages.error.nameUnique);
    //   }
    //   await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{name:name, about:about ,dob:dob,gender:gender});      
 
    // }
    //console.log('req.body',req.body);   
    const users = await User.findOne({  _id: req.user._id ,usertype:"b_user", isDeleted:false});
    if(users){     
      if (req.files && req.files['profile_photo'] && req.files['profile_photo'][0]) {
        if (users.profile_photo) {
          await deleteToS3(users.profile_photo)
        }
        var profile_photo = req.files['profile_photo'][0];
        var profile_photoimageUrl = await uploadToS3(profile_photo.filename, profile_photo.path);  
        await service.findOneAndUpdateForAwait(User,{ _id: req.user._id },{ profile_photo:profile_photoimageUrl}); 
      }     
      if (req.files && req.files['cover_photo'] && req.files['cover_photo'][0]) {        
        if (users.cover_photo) {
          await deleteToS3coverphotos(users.cover_photo)
        }
        var cover_photo = req.files['cover_photo'][0];
        var cover_photoimageUrl = await uploadToS3cover_photo(cover_photo.filename, cover_photo.path);
        await service.findOneAndUpdateForAwait(User,{ _id: req.user._id },{ cover_photo:cover_photoimageUrl});
      }             
      if(openinghours){
        const openingHoursArray = JSON.parse(openinghours);
        console.log('openingHoursArray',openingHoursArray);
          if(openingHoursArray.length > 0){
            await Promise.all(openingHoursArray.map(async (row) => {
              console.log('openingHours',row);
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
                  if(openingtime.status == 0){
                    var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { opening_hours: openingtime.id } });  
                  }
                  var updateuser = await service.findOneAndUpdateForAwait(Openinghours,{ day: row.day ,user_id :req.user._id},{ status:row.status ,starttime:row.starttime,endtime:row.endtime,starttimef:fromtime,endtimef:totime}); 
              }       
            }));
          }     
      }     
      if(deleteopeningHours){
        const deleteopeningHoursArray = JSON.parse(deleteopeningHours);
        console.log('deleteopeningHoursArray',deleteopeningHoursArray);
        if(deleteopeningHoursArray.length > 0){
          await Promise.all(deleteopeningHoursArray.map(async (row) => {
            console.log('openingHoursdelete',row);
            const openingtime = await Openinghours.findOne({_id: row.hours_id ,user_id :req.user._id }); 
            if(openingtime)  {
              var updatehours = await service.findOneAndUpdateForAwait(Openinghours,{ _id: row.hours_id ,user_id :req.user._id},{ status:'0'});  
              const updateuser = await User.findOneAndUpdate(
                { _id:req.user._id },
                { $pull: { opening_hours: row.hours_id } },
                { new: true } // This option returns the updated document
              );
            }          
          }));
        }
      }     
      if(services){
        const servicesArray = JSON.parse(services);
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
              }else{
                if(userservice.isDeleted == "true"){
                  var updateuserservice = await service.findOneAndUpdateForAwait(UseraddServices,{ _id:userservice.id },{isDeleted:false  });
                  var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $push: { services: userservice.id } });

                }
              }      
            }               
            }));
        } 
      }
     if(deleteServices){
      const deleteServicesArray = JSON.parse(deleteServices);
      if(deleteServicesArray.length > 0){
        await Promise.all(deleteServicesArray.map(async (row) => {
          const userservice = await UseraddServices.findOne({_id: row.service_id ,user_id:req.user._id});
          console.log(row);
          console.log('userservice',userservice);
            if(userservice){              
              var updateuser = await service.findOneAndUpdateForAwait(User,{ _id:req.user._id },{  $pull: { services: userservice.id } });
              var updateuserservice = await service.findOneAndUpdateForAwait(UseraddServices,{ _id:userservice.id },{isDeleted: true});
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
 * This Functions is used for create services
 */
const getuserServices = async (req, res, next) => {
  try {    
    let {offset,limit,search} = req.query;
      let page = parseInt(offset) || 1;
      let limitn = parseInt(limit) || 20;
      const skip = (page - 1) * limitn;      
        if(search == '' || search == undefined){
          var userservice = await UseraddServices.find({ userId:req.user._id,isDeleted:false }, {categoryName: 1,_id: 1 ,service_id:1})
          .limit(limitn).skip(skip);  
        }else{
          var userservice = await UseraddServices.find( {
            'name': { $regex: search
            },userId:req.user._id,isDeleted:false}, {categoryName: 1,_id: 1 ,service_id:1}).limit(limitn).skip(skip);  
        }
    return new SuccessResponse(messages.success.fetchsucess,{userservice}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get business user sub services(hair color) 
 */
const getSubCategory = async (req, res, next) => {
  try {  
  let {service_id,offset,limit,search} = req.query
  let page = parseInt(offset) || 1;
    let limitn = parseInt(limit) || 20;
    const skip = (page - 1) * limitn;
    if(search == '' ||search == undefined){ 
        var data = await Subservices.aggregate([
          {
            $match: {
              service_id:ObjectId(service_id) ,
              isDeleted: false
            }
          },
          {$limit:limitn},
          {$skip:skip},          
          {
            $project: {
              'name': 1,
              '_id': 1,
            }
          },
        ]);
    }else{
      var data = await Subservices.aggregate([
        {
          $match: {
            'name': { $regex: search
            },
            service_id:ObjectId(service_id),
            isDeleted: false
          }
        },
        {$limit:limitn},
        {$skip:skip},        
        {
          $project: {
            'name': 1,
            '_id': 1,
          }
        },
      ]);
    }      
  return new SuccessResponse(messages.success.fetchsucess, {
    subcategorylist:data,
  }).send(res);
          
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * This Functions is used for create services
 */
const createServices = async (req, res, next) => {
  try {
    let { serviceName, price, description, catSubcatArr } = req.body;
     const catSubcatArrArray = JSON.parse(catSubcatArr);
    let createservice = await new Buservices({
      serviceName: serviceName,
      description:description,
      price:price,
      user_id:req.user._id
    });  
    await service.createForAwait(createservice);
    //add services and subservices 
    await Promise.all(catSubcatArrArray.map(async (cat) => {
      console.log('catSubcatArrArray',cat);
      const categories = await UseraddServices.findOne({_id: cat.category_id });
      const servicename = await Services.findOne({_id: categories.service_id });
      console.log('services',categories);
      console.log('servicename',servicename);
      let createcat = await new UserCategories({
        categoryName: servicename.name,
        buserservices_id:createservice._id,
        service_id:servicename.id,
        userservice_id:cat.category_id,
        user_id:req.user._id
      });    
      await service.createForAwait(createcat);
      var updateuser = await service.findOneAndUpdateForAwait(Buservices,{ _id:createservice._id },{  $push: { userCategories_ids: createcat._id } });          
      await Promise.all(cat.subcategory.map(async (sub) => {
        console.log('sub',sub);        
        const subservicename = await Subservices.findOne({_id: sub.subcategory_id });
        console.log('subservicename',subservicename);
        if(subservicename){
          let createsubservice = await new UserSubcategories({
            subcategoryName: subservicename.name,
            buserservices_id:createservice._id,
            userCategories_id:createcat._id,
            subservice_id:subservicename.id,
            user_id:req.user._id
          });  
          await service.createForAwait(createsubservice);
          //----update subcategories in buser services 
          var updateuser = await service.findOneAndUpdateForAwait(Buservices,{ _id:createservice._id },{  $push: { userSubcategories_ids: createsubservice._id } });   
          //----update subcategories in user categories table
          var updateSubcategoties = await service.findOneAndUpdateForAwait(UserCategories,{ _id:createcat._id },{  $push: { subCategories_ids: createsubservice._id } });   
        }               
        }));      
      }));
      if (req.files ) {
        var serviceImage = req.files;
        if(serviceImage.length > 0){
          console.log('serviceImage',serviceImage);
          await Promise.all(serviceImage.map(async (row) => {
            console.log('serviceImage',row);
            var imageUrl = await uploadToS3(row.filename, row.path);       
            var updateuser = await service.findOneAndUpdateForAwait(Buservices,{ _id:createservice._id },{  $push: { serviceImages: imageUrl } });           
                  
          }));
        }         
      } 
    return new SuccessResponse(messages.success.ServiceCreateSucess).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * This Functions is used for Get services
 */
const getBuserAllServices = async (req, res, next) => {
  try {  
  let {offset,limit} = req.query
  console.log("req.user._id",req.user._id);
  let page = parseInt(offset) || 1;
    let limitn = parseInt(limit) || 20;
    const skip = (page - 1) * limitn;
    const users = await User.findOne({ _id: req.user._id ,usertype:"b_user", isDeleted:false});
    var data = await Buservices.aggregate([
      {
        $match: {
          user_id:req.user._id ,
          isDeleted: false
        }
      },
      {$limit:limitn},
      {$skip:skip},            
      {
        $project: {
          'serviceName': 1,
          'serviceImages': 1,
          '_id': 1,
          'username':1,
        }
      },
    ]); 
    
    if (!data || data.length === 0) {
      return new NotFoundError('No services found for the user');
    }

    const responseData = {
      services: data,
      username: users.name,
      place: users.place,
      latitude: users.latitude,
      longitude: users.longitude,
      rating:0
    };
  return new SuccessResponse(messages.success.fetchsucess, {
    responseData,
  }).send(res);
          
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * This Functions is used for Get Single service
 */
const getSingleService = async (req, res, next) => {
  try {  
  let {service_id} = req.query    
  const user = await User.findOne({ _id: req.user._id ,usertype:"b_user", isDeleted:false},'name profile_photo mobile place latitude longitude');
  const data = await Buservices.aggregate([
    {
      $match: {
        _id: ObjectId(service_id),
        user_id: req.user._id,
        isDeleted: false
      }
    },    
    {
      $lookup: {
        from: "usercategories",
        localField: "userCategories_ids",
        foreignField: "_id",
        as: "userCategories"
      }
    },
    {
      $unwind: "$userCategories"
    },
    {
      $lookup: {
        from: "subcategories",
        localField: "userCategories.subCategories_ids",
        foreignField: "_id",
        as: "userCategories.userSubCategories"
      }
    },  
    {
      $group: {
        _id: "$_id",
        serviceName: { $first: "$serviceName" },
        description: { $first: "$description" },
        price: { $first: "$price" },
        serviceImages: { $first: "$serviceImages" },
        userCategories_ids: { $first: "$userCategories_ids" },
        userSubcategories_ids: { $first: "$userSubcategories_ids" },
        user_id: { $first: "$user_id" },
        status: { $first: "$status" },
        isDeleted: { $first: "$isDeleted" },
        createdAt: { $first: "$createdAt" },
        updatedAt: { $first: "$updatedAt" },
        __v: { $first: "$__v" },
        userCategories: { $push: "$userCategories" }
      }
    },
  ]);
  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
  const hours = await Openinghours.aggregate([
    {
      $match: {
        user_id: req.user._id,
        isDeleted: false
      }
    },       
    
    {
      $project: {
        'day': 1,
        'starttime': { $substr: ['$starttimef', 11, 5] }, // Extract time from starttimef
        'endtime': { $substr: ['$endtimef', 11, 5] },     // Extract time from endtimef        
        '_id': 1
      }
    }, 
  ]); 
  const fullWeekData = daysOfWeek.map((day) => {
    const openingHours = hours.find((oh) => oh && oh.day && oh.day.toLowerCase() === day.toLowerCase());
    if (openingHours) {
      return {
        day: day,
        starttime: openingHours.starttime,
        endtime: openingHours.endtime,
        isOpen: 'open',
      };
    } else {
      return {
        day: day,
        isOpen: 'closed',
      };
    }
  });
  var allservices = await Buservices.aggregate([
    {
      $match: {
        user_id:req.user._id ,
        isDeleted: false
      }
    },         
    {
      $project: {
        'serviceName': 1,
        'serviceImages': 1,
        '_id': 1,
        'username':1,
      }
    },
  ]); 
  return new SuccessResponse(messages.success.fetchsucess, {
    service:data,
    allservices:allservices,
    user:user,
    opening_hours:fullWeekData,
    gallery:[],
    review:[],
    gigs:[]
  }).send(res);          
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const updateService = async (req, res, next) => {
  try {  
  let {service_id,serviceName,description,price,deletedserviceImages} = req.body; 
  if(!service_id){
    return res.status(422).json({ status:"Validation error", "message": "service_id is required","statusCode": 422 });
  }
  const user = await User.findOne({ _id: req.user._id ,usertype:"b_user", isDeleted:false});
  const bservice = await Buservices.findOne({_id:service_id, user_id: req.user._id ,isDeleted:false});
  if(bservice){
    if (req.files ) {
      var serviceImage = req.files;
      if(serviceImage){
        if(serviceImage.length > 0){
          await Promise.all(serviceImage.map(async (row) => {
            var imageUrl = await uploadToS3(row.filename, row.path);       
            var updateuser = await service.findOneAndUpdateForAwait(Buservices,{_id:service_id, user_id: req.user._id },{  $push: { serviceImages: imageUrl } }); 
          }));
        }     
      }          
    } 
    if(deletedserviceImages){
      const deletedImagesArray = JSON.parse(deletedserviceImages); 
      for (const deletedImage of deletedImagesArray) {
        if (bservice.serviceImages.includes(deletedImage)) {
          console.log('deletedImage',deletedImage);
          await deleteToS3(deletedImage)
          await Buservices.updateMany({ user_id: req.user._id,_id:service_id}, { $pull: { serviceImages: deletedImage } });
          console.log(`Deleted image ${deletedImage} from the database.`);
        }
      }  
    }
    await service.findOneAndUpdateForAwait(Buservices,{user_id: req.user._id,_id:service_id },{  serviceName: serviceName,description:description,price});          

  }else{
    throw new NotFound('This service not found');
  }
  
  
  return new SuccessResponse(messages.success.updatesucess).send(res);          
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const deleteService = async (req, res, next) => {
  try {  
    let {
      service_id ,
  } = req.body
  if(service_id == ''){
    return res.status(422).json({ status:"Validation error", "message": "service_id is required please add","statusCode": 422 });
  }
  var ser = await Buservices.findOne({_id:service_id,isDeleted:false}) 
  if(ser){
    await service.findOneAndUpdateForAwait(Buservices, { _id: service_id }, { isDeleted:true });      
    return new SuccessResponse(messages.success.deletesucess).send(res);
  }else{
    return new NotFoundResponse("This service not exist").send(res);
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
  getBuserProfile,
  updateBuserProfile,
  getuserServices,
  getSubCategory,
  createServices,
  getBuserAllServices,
  getSingleService,
  updateService,
  deleteService
};
