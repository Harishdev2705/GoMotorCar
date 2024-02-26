
const service = require("../../services/mongodb.services");
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const { User, Orders, Review, Appointment, Transaction, Promocode, Notification,Openinghours,Services,UseraddServices,VerificationRequests } = require("../../models/index");
const messages = require("../../utility/message");
const { isValidObjectId } = require("mongoose");

const { ObjectId } = require("bson");


/**
 * @description - This function is used for get user list
 */
const getUserList = async (req, res, next) => {
    try {
        let { type ,search} = req.query;
        // query meter details
        let skip = req.query.offset || 0;
        let limit = req.query.limit || 100;
        if(type === 'user'){
            if(search == '' || search == undefined){
                console.log('type',type);
                var userlist = await service.findManyForAwaitWithSortSkipAndLimit(User, { isDeleted: false ,usertype:'user',profile_status:'3'},{},{ createdAt: -1 }, skip, limit);

            }else{
                var userlist = await User.find( {
                    'name': { $regex: search
                    },isDeleted: false ,usertype:'user',profile_status:'3'}).limit(limit).skip(skip);
            }
        }else{
            if(search == '' || search == undefined){
                var userlist = await service.findManyForAwaitWithSortSkipAndLimit(User, { isDeleted: false ,usertype:'b_user',profile_status:'3'},{},{ createdAt: -1 }, skip, limit);
            }else{
                var userlist = await User.find( {
                    'name': { $regex: search
                    },isDeleted: false ,usertype:'b_user',profile_status:'3'}).limit(limit).skip(skip);
            }            
        }        
        if (!userlist) {
            throw new BadRequest(messages.error.noUserFound);
        }
        return new SuccessResponse(messages.success.userList, {
          userlist
        }).send(res);
    } catch (error) {
        throw new BadRequest(error.message)
    }
};
/**
 * @description - This function is used for get user details
 */
const getUserDetails = async (req, res, next) => {
    try {
        let id = req.params.id
        let user = await service.findOneForAwait(User, { _id: id },{});
        if(user.usertype == "b_user"){
            var userProfile = await User.aggregate([
                {
                  $match: { _id:ObjectId(id),isDeleted:false }
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
                    'business_id':1,                    
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
                    'isVerified':1,
                    '_id': 1,
                  }
                },
              ]); 
              const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
              const hours = await Openinghours.aggregate([
                {
                  $match: {
                    user_id:ObjectId(id) ,
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
            if (!userProfile) {
                throw new BadRequest(messages.error.noUserFound);
            }
            return new SuccessResponse(messages.success.userDetail, {
                userProfile,opening_hours:fullWeekData
            }).send(res);
        }else if(user.usertype == "user"){
            var userProfile = await User.aggregate([
                {
                  $match: { _id:ObjectId(id) ,usertype:"user",isDeleted:false }
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
                    'review':1,
                    'profile_photo':1,
                    'about': 1,
                    'place': 1,
                    'loginStatus':1,
                    'isVerified':1,
                    '_id': 1,
                  }
                },
              ]); 
            return new SuccessResponse(messages.success.fetchsucess,{userProfile}).send(res);
        }
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }
    } catch (error) {
        throw new BadRequest(error.message) 
    }
};
/**
 * @description - This function is used for delete user
 */
const deleteUser = async (req, res, next) => {
    try {
        let id = req.params.id
        let userDetails = await service.findOneForAwait(User, { _id: id },{});
        if (!userDetails) {
            throw new BadRequest(messages.error.noUserFound);
        }
        await service.findOneAndUpdateForAwait(User, { _id: id }, { isDeleted: true });
        return new SuccessResponse(messages.success.userDeleted).send(res);
    } catch (error) {
        throw new BadRequest(error.message) 
    }
  };
  /**
 * @description - This function is used for get users verifications requests
 */
const getVerificationsRequests = async (req, res, next) => {
    try {
        let { type ,search} = req.query;
        if(type == 'user'){
            type = 'user'
        }else{
            type = 'b_user'
        }
        let skip = req.query.offset || 0;
        let limit = req.query.limit || 100;
        var pipeline = [
            {
                $match: { usertype: type, isDeleted: false, isVerified: false }
            },
            { $sort: { updatedAt: -1 } },
            { $skip: parseInt(skip) },
            { $limit: parseInt(limit) },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "user"
                }
            }
        ];
        
        if (search) {
            pipeline.push({
                $match: {
                    "user.name": { $regex: '.*' + search + '.*', $options: 'i' }
                }
            });
        }
        var Requests = await VerificationRequests.aggregate(pipeline);
        return new SuccessResponse(messages.success.fetchsucess, {
            Requests
        }).send(res);
    } catch (error) {
        throw new BadRequest(error.message) 
    }
};
/**
 * user verify Account through id
 *
 */
const verifyUnverifyuser = async (req, res, next) => {
  try {
      let { id, status } = req.body;
      let user = await service.findOneForAwait(User, { _id: id, isDeleted: false }, {});
      if (!user) {
          throw new BadRequest(messages.error.noUserFound);
      }
      await service.findOneAndUpdateForAwait(User, { _id: id }, { isVerified: status });
      await service.findOneAndUpdateForAwait(VerificationRequests, { user_id: id }, { isVerified: status });
      return new SuccessResponse(messages.success.statusChange).send(res);
  } catch (error) {
      throw new BadRequest(error.message)
  }
};
/**
 * Get user Delete Account through token
 *
 */
const accountBlockUnBlock = async (req, res, next) => {
    try {
        let { id, status } = req.body;
        let user = await service.findOneForAwait(User, { _id: id, isDeleted: false }, {});
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }

        await service.findOneAndUpdateForAwait(User, { _id: id }, { isBlocked: status });
        return new SuccessResponse(messages.success.statusChange).send(res);

    } catch (error) {
        throw new BadRequest(error.message)
    }
};

/**
 * Get user Approved Account through token
 *
 */
const accountApproved = async (req, res, next) => {
    try {
        let { id } = req.body;
        let user = await service.findOneForAwait(User, { _id: id, isDeleted: false }, {});
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }

        await service.findOneAndUpdateForAwait(User, { _id: id }, { isApproved: true });
        return new SuccessResponse(messages.success.statusChange).send(res);

    } catch (error) {
        throw new BadRequest(error.message)
    }
};

/**
 * Get user Delete Account through token
 *
 */
const deleteAccount = async (req, res, next) => {
    try {
        let id = req.params.id

        let user = await service.findOneForAwait(User, { _id: id, isDeleted: false }, {});
        if (!user) {
            throw new BadRequest(messages.error.noUserFound);
        }
        await User.remove({ _id: id })
        return new SuccessResponse(messages.success.deleteAccount).send(res);

    } catch (error) {
        throw new BadRequest(error.message)
    }
};

/**
 * @description - This function is used for delete Product
 */
const deleteAllUser = async (req, res, next) => {
    try {
      await User.deleteMany({ role: { $ne: 'admin' } });
      return res.status(200).json({ message: "All user deleted successfully." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };


/**
 * @description - This function is used for delete Product
 */
const deleteAllOrderReviewAppoi = async (req, res, next) => {
    try {
      await Orders.deleteMany()
      await Review.deleteMany()
      await Appointment.deleteMany()
      await Transaction.deleteMany()
      await Promocode.deleteMany()
      await Notification.deleteMany()
      return res.status(200).json({ message: "All user deleted successfully." });
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  };


module.exports = {
    getUserDetails,
    getUserList,
    deleteUser,
    getVerificationsRequests,
    verifyUnverifyuser,
    accountBlockUnBlock,
    deleteAccount,
    deleteAllUser,
    deleteAllOrderReviewAppoi,
    accountApproved
};