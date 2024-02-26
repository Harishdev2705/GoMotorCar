const service = require("../../services/mongodb.services");
const { SuccessResponse,NotFoundResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { User ,UserFunctions_list,Functions,Services,Subservices} = require("../../models/index");
const messages = require("../../utility/message");
const fs = require("fs");
const path = require("path");

/**
 * @description - This function is used for create user Functions like (interests,dietary,Specialization) 
 */
const createfunctions_list = async (req, res, next) => {
  try {
    let { name} = req.body;  
      let Userf = await new Functions({
        name,
      });
      await service.createForAwait(Userf);
      return new SuccessResponse(messages.success.created, {
        data: Userf,
      }).send(res);    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for create user Functions like (interests,dietary,Specialization) 
 */
const create_user_functions = async (req, res, next) => {
  try {
    let { name,type} = req.body;  

      const userfun = await UserFunctions_list.findOne({ name:name,isDeleted:false});
      if(!userfun){
        const fun = await Functions.findOne({ name:type,isDeleted:false});
        if(fun){
          let Userf = await new UserFunctions_list({
            name,
            type, 
            function_id:fun._id  
          });
          await service.createForAwait(Userf);
          return new SuccessResponse(messages.success.created, {
            data: Userf,
          }).send(res);
        }else{
          return new NotFoundResponse("Please enter valid Type").send(res);
        } 
      }else{
        return new NotFoundResponse("This function already exist").send(res);
      }         
    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for create user Functions like (interests,dietary,Specialization) 
 */
const functions_type_list = async (req, res, next) => {
  try {  
      const fun = await Functions.find({isDeleted:false});   
        return new SuccessResponse(messages.success.fetchsucess, {
          data: fun,
        }).send(res);    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get user Functions lists 
 */
const usersfunctions_list = async (req, res, next) => {
  try {  
    let {type  ,offset,
      limit,search} = req.body;
      let page = parseInt(offset) || 1;
      let limitn = parseInt(limit) || 20;
      const skip = (page - 1) * limitn;
      const funcion = await Functions.findOne({ name:type});
      if(funcion){
        if(search == '' || search == undefined){
          var fun = await UserFunctions_list.find({type:req.body.type,isDeleted:false}).limit(limitn).skip(skip);  
        }else{
          var fun = await UserFunctions_list.find( {
            'name': { $regex: search
            },type:req.body.type,isDeleted:false}).limit(limitn).skip(skip);  
        }
        return new SuccessResponse(messages.success.fetchsucess, {
          data: fun,
        }).send(res);  
      }else{
        return new NotFoundResponse("Please enter valid Type").send(res);
      }            
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get single user Functions 
 */
const getSingleusersfunction = async (req, res, next) => {
  try {  
    let {id} = req.query; 
    // var fun = await UserFunctions_list.findOne({_id:id});
    let fun = await service.findOneForAwait(UserFunctions_list, { _id: id, isDeleted: false }, {});

      if(fun){
        return new SuccessResponse(messages.success.fetchsucess, {
          data: fun,
        }).send(res);  
      }else{
        return new NotFoundResponse("Please enter valid id").send(res);
      }            
  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for update single user Functions 
 */
const updateusersfunctions = async (req, res, next) => {
  try {  
    let {id,name} = req.body; 
    if(name == ''){
      return res.status(422).json({ status:"Validation error", "message": "Name is required please add","statusCode": 422 });
    }
    var fun = await UserFunctions_list.findOne({_id:id});
      if(fun){
        await service.findOneAndUpdateForAwait(UserFunctions_list, { _id: id }, { name });
        return new SuccessResponse(messages.success.updatesucess).send(res);
      }else{
        return new NotFoundResponse("Please enter valid id").send(res);
      }            
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for delete single user Functions 
 */
const deleteusersfunctions = async (req, res, next) => {
  try {  
    let {id} = req.body; 
    if(id == ''){
      return res.status(422).json({ status:"Validation error", "message": "Id is required please add","statusCode": 422 });
    }
    var fun = await UserFunctions_list.findOne({_id:id,isDeleted:false});
      if(fun){
        await service.findOneAndUpdateForAwait(UserFunctions_list, { _id: id }, { isDeleted:true });
        return new SuccessResponse(messages.success.deletesucess).send(res);
      }else{
        return new NotFoundResponse("Please enter valid id").send(res);
      }            
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for create business user services(hair,massage) 
 */
const createServices = async (req, res, next) => {
  try {  
    let { name} = req.body;  

      const ser = await Services.findOne({ name:name,isDeleted:false});
      if(!ser){
        let servic = await new Services({
          name,  
        });
        await service.createForAwait(servic);
        return new SuccessResponse(messages.success.created, {
          data:servic,
        }).send(res);
      }else{
        return new NotFoundResponse("This service already exist").send(res);
      }     
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for create business user sub services(hair cutting,spa) 
 */
const createSubServices = async (req, res, next) => {
  try {  
    let { service_id ,name} = req.body;  
    var exist = await Subservices.findOne({name:name,isDeleted:false}) 
    if(!exist){
      const services = await Services.findOne({ _id:service_id,isDeleted:false});
      if(services){
        const ser = await Subservices.findOne({ name:name,isDeleted:false});
        if(!ser){
          let subservic = await new Subservices({
            name,
            service_id:service_id,
            service_name:services.name   
          });
          await service.createForAwait(subservic);
          var updateuser = await service.findOneAndUpdateForAwait(Services,{ _id:service_id },{  $push: { subservices_ids: subservic._id } });              

          return new SuccessResponse(messages.success.created, {
            data:subservic,
          }).send(res);
        }else{
          return new NotFoundResponse("This service already exist").send(res);
        } 
      }else{
        return new NotFoundResponse("This service not exist").send(res);
      }
    }else{
      return new NotFoundResponse("This sub service name already exist").send(res);
    }
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get business user services(hair color) 
 */
const getServices = async (req, res, next) => {
  try {  
    let {
      offset,
      limit,
      search
  } = req.query
  let page = parseInt(offset) || 1;
    let limitn = parseInt(limit) || 20;
    const skip = (page - 1) * limitn;
    if(search == '' ||search == undefined){
        var ser = await Services.find({isDeleted:false}).limit(limitn).skip(skip);  
    }else{
      var ser = await Services.find( {
        'name': { $regex: search
        }}).limit(limitn).skip(skip);  
    }
  return new SuccessResponse(messages.success.fetchsucess, {
    servicelist:ser,
  }).send(res);
          
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get business user sub services(hair color) 
 */
const getsubServices = async (req, res, next) => {
  try {  
    let {
      offset,
      limit,
      search
  } = req.query
  let page = parseInt(offset) || 1;
    let limitn = parseInt(limit) || 20;
    const skip = (page - 1) * limitn;
    if(search == '' ||search == undefined){ 
        var data = await Subservices.aggregate([
          {
            $match: {
              isDeleted: false
            }
          },
          {$limit:limitn},
          {$skip:skip},
          {
            $lookup: {
              from: 'services',
              localField: 'service_id',
              foreignField: '_id',
              as: 'service',
            }
          },
          {
            $addFields: {
              'service': '$service.name'
            }
          },
           {"$unwind":"$service"},
          {
            $project: {
              'name': 1,
              'service': 1,
            }
          },
        ]);
    }else{
      var data = await Subservices.aggregate([
        {
          $match: {
            'name': { $regex: search
            },
            isDeleted: false
          }
        },
        {$limit:limitn},
        {$skip:skip},
        {
          $lookup: {
            from: 'services',
            localField: 'service_id',
            foreignField: '_id',
            as: 'service',
          }
        },
        {
          $addFields: {
            'service': '$service.name'
          }
        },
        {"$unwind":"$service"},
        {
          $project: {
            'name': 1,
            'service': 1,
          }
        },
      ]);
    }      
  return new SuccessResponse(messages.success.fetchsucess, {
    subservicelist:data,
  }).send(res);
          
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get single services(hair color) 
 */
const getOneServices = async (req, res, next) => {
  try {  
    let {
      id     
  } = req.query
  var ser = await Services.findOne({_id:id,isDeleted:false}) 
  if(ser){
    return new SuccessResponse(messages.success.fetchsucess, {
      data:ser,
    }).send(res);
  }else{
    return new NotFoundResponse("This service not exist").send(res);
  }     
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get single sub services
 */
const getOnesubServices = async (req, res, next) => {
  try {  
    let {
      id     
  } = req.query
  var ser = await Subservices.findOne({_id:id,isDeleted:false}) 
  if(ser){
    return new SuccessResponse(messages.success.fetchsucess, {
      data:ser,
    }).send(res);
  }else{
    return new NotFoundResponse("This service not exist").send(res);
  }     
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get update services
 */
const updateServices = async (req, res, next) => {
  try {  
    let {
      id ,
      name,
  } = req.body
  if(name == ''){
    return res.status(422).json({ status:"Validation error", "message": "Name is required please add","statusCode": 422 });
  }
  var exist = await Services.findOne({name:name}) 
  if(!exist){
    var ser = await Services.findOne({_id:id}) 
    if(ser){
      await service.findOneAndUpdateForAwait(Services, { _id: id }, { name });
      return new SuccessResponse(messages.success.updatesucess).send(res);
    }else{
      return new NotFoundResponse("This service not exist").send(res);
    }   
  }else{
    return new NotFoundResponse("This service name already exist").send(res);
  }
    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for update Sub services
 */
const updateSubServices = async (req, res, next) => {
  try {  
    let {
      id ,
      name,
  } = req.body
  if(name == ''){
    return res.status(422).json({ status:"Validation error", "message": "Name is required please add","statusCode": 422 });
  }
  var exist = await Subservices.findOne({name:name}) 
  if(!exist){
    var ser = await Subservices.findOne({_id:id}) 
    if(ser){
      await service.findOneAndUpdateForAwait(Subservices, { _id: id }, { name });
      return new SuccessResponse(messages.success.updatesucess).send(res);
    }else{
      return new NotFoundResponse("This Sub service not exist").send(res);
    }   
  }else{
    return new NotFoundResponse("This sub service name already exist").send(res);
  }
    
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get update services
 */
const deleteServices = async (req, res, next) => {
  console.log('ser');
  try {  
    let {
      id ,
  } = req.body
  if(id == ''){
    return res.status(422).json({ status:"Validation error", "message": "id is required please add","statusCode": 422 });
  }
  var ser = await Services.findOne({_id:id,isDeleted:false}) 
  if(ser){
    await service.findOneAndUpdateForAwait(Services, { _id: id }, { isDeleted:true });
    await Promise.all(ser.subservices_ids.map(async (row) => {  
      console.log('row',row);    
      const subser = await Subservices.findOne({ _id:row,isDeleted:false});
      if(subser){
        await service.findOneAndUpdateForAwait(Subservices, { _id: row }, { isDeleted:true });
        // const updateuser = await Userservices.findOneAndUpdate(
        //   { _id: id },
        //   { $pull: { opening_hours: hoursIdToRemove } },
        //   { new: true } // This option returns the updated document
        // );
      }
    }))
    return new SuccessResponse(messages.success.deletesucess).send(res);
  }else{
    return new NotFoundResponse("This service not exist").send(res);
  }     
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get update services
 */
const deletesubServices = async (req, res, next) => {
  try {  
    let {
      id ,
  } = req.body
  if(id == ''){
    return res.status(422).json({ status:"Validation error", "message": "id is required please add","statusCode": 422 });
  }
  var ser = await Subservices.findOne({_id:id,isDeleted:false}) 
  if(ser){
    await service.findOneAndUpdateForAwait(Subservices, { _id: id }, { isDeleted:true });
    const updateuser = await Services.findOneAndUpdate(
          { _id:ser.service_id },
          { $pull: { subservices_ids: id } },
          { new: true } // This option returns the updated document
        );   
    return new SuccessResponse(messages.success.deletesucess).send(res);
  }else{
    return new NotFoundResponse("This service not exist").send(res);
  }     
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
module.exports = {
  createfunctions_list,
  create_user_functions,
  functions_type_list,
  usersfunctions_list,
  getSingleusersfunction,
  updateusersfunctions,
  deleteusersfunctions,
  createServices,
  createSubServices,
  getServices,
  getsubServices,
  getOneServices,
  getOnesubServices,
  updateServices,
  updateSubServices,
  deleteServices,
  deletesubServices
};
