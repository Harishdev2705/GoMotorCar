const service = require("../../services/mongodb.services");
const { SuccessResponse } = require("../../utility/apiResponse");
const { BadRequest } = require("../../utility/apiError");
const commonHelper = require("../../helper/common");
const { User,caradd,carModel,FuelType,Transmission,CarCategory } = require("../../models/index");
const messages = require("../../utility/message");
const fs = require("fs");
const path = require("path");
const sendEmail = require("../../helper/sendEmail");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../../utility/config");
const { uploadToS3, deleteToS3 } = require("../../middlewares/aws-config");
var base64ToImage = require('base64-to-image');
const { log } = require("winston");

/**
 * @description - This function is used for add car
 */
const Addcar = async (req, res, next) => {
  try {
    let {name , carImage} = req.body;
    console.log('carImage',carImage);
    if(name == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }
    // let carImage = req.file;   
    // if(carImage == undefined){
    //   return new SuccessResponse("Please choose image").send(res);
    // }
    //  const car = await caradd.findOne({ name: name });
    // var userphone = users.mobile;
    var base64Str = carImage;
                var file_name = Date.now()
                //  const uploadDigr = 'uploads\\images\\ '+file_name+ '.png';
                 const uploadDir = '/var/www/html/uploads/';

                // var imageInfo = base64ToImage(base64Str, uploadDir, file_name + '.png');
                // console.log('imageInfo',imageInfo);
                // const imageBuffer = await fs.promises.readFile(filePath);
    const imageUrl = await uploadToS3(file_name, carImage);
    console.log('imageUrl',imageUrl);
    let newUser = await new caradd({
      name,
      carImage:imageUrl
    });

    await service.createForAwait(newUser);
   
    return new SuccessResponse("Created Sucessfully").send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get car
 */
const cars = async (req, res, next) => {
  try {  
    const cars = await caradd.find({isDeleted:false}); 
   
    return new SuccessResponse("Sucessfully Get",{cars}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is create car model
 */
const AddcarModel = async (req, res, next) => {
  try {
    let {carID,name} = req.body;
    if(carID== undefined, name == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }
    let carImage = req.file;  
    console.log('carImage',carImage); 
    if(carImage == undefined){
      return new SuccessResponse("Please choose image").send(res);
    }
    //  const car = await caradd.findOne({ name: name });
    // var userphone = users.mobile;
    const imageUrl = await uploadToS3(carImage.filename, carImage.path);
    console.log('imageUrl',imageUrl);
    let newUser = await new carModel({
      carID,
      name,
      carImage:imageUrl
    });
    await service.createForAwait(newUser);
   
    return new SuccessResponse("Created Sucessfully").send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const carsModel = async (req, res, next) => {
  try {
    let {carID} = req.query;
    console.log('req.body q',req.query);
    if(carID== undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }
    const cars = await carModel.find({carID:carID,isDeleted:false}); 
    
    return new SuccessResponse("Sucessfully Get",{cars}).send(res);

  } catch (error) {
    throw new BadRequest(error.message);
  }
};

/**
 * @description - This function is used for add car
 */
const AddFuelType = async (req, res, next) => {
  try {
    let {name} = req.body;
    if(name == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }
    let Image = req.file;   
    if(Image == undefined){
      return new SuccessResponse("Please choose image").send(res);
    }
    //  const car = await caradd.findOne({ name: name });
    // var userphone = users.mobile;
    const imageUrl = await uploadToS3(Image.filename, Image.path);
    console.log('imageUrl',imageUrl);
    let newUser = await new FuelType({
      name,
      Image:imageUrl
    });

    await service.createForAwait(newUser);
   
    return new SuccessResponse("Created Sucessfully").send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for add car
 */
const AddCarCategory = async (req, res, next) => {
  try {
    let {name} = req.body;
    if(name == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }
    let newUser = await new CarCategory({
      name,
    });

    await service.createForAwait(newUser);
   
    return new SuccessResponse("Created Sucessfully").send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const CarCategories = async (req, res, next) => {
  try {
    const cars = await CarCategory.find({isDeleted:false}); 
   
    return new SuccessResponse("Sucessfully Get",{cars}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
/**
 * @description - This function is used for get car
 */
const Fueltype = async (req, res, next) => {
  try {  
    const cars = await FuelType.find({isDeleted:false}); 
   
    return new SuccessResponse("Sucessfully Get",{cars}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const AddtransmissionType = async (req, res, next) => {
  try {
    let {name} = req.body;
    if(name == undefined ){
      return res.status(422).json({ status:"Validation error", "message": "All fields is required","statusCode": 422 });
    }   
    let newUser = await new Transmission({
      name,
    });

    await service.createForAwait(newUser);
   
    return new SuccessResponse("Created Sucessfully").send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
const transmissionType = async (req, res, next) => {
  try {
    const cars = await Transmission.find({isDeleted:false}); 
   
    return new SuccessResponse("Sucessfully Get",{cars}).send(res);
  } catch (error) {
    throw new BadRequest(error.message);
  }
};
module.exports = {
  Addcar,
  AddcarModel,
  cars,
  carsModel,
  AddFuelType,
  Fueltype,
  AddtransmissionType,
  transmissionType,
  AddCarCategory,
  CarCategories
};
