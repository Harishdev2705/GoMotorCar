const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/user/user.controller");
const BuserController = require("../../../controllers/user/Businessuser.controller");
const { userAuth } = require("../../../middlewares/userAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler');
const { updateProfileValidation, updateUnitAndNotificationValidation, addMonyToWalletValidation } = require("../../../validations/user.validations");
const { imageUpload,imagesUpload } = require("../../../middlewares/multerUploads");

// /**
//  * @swagger
//  * /v1/buser/getProfile:
//  *   get:
//  *     tags:
//  *       - Business User
//  *     summary: 'Get Profile'
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */
// router.get("/getProfile", userAuth, asyncHandler(BuserController.getProfile));

// /**
//  * @swagger
//  * /v1/buser/getBuserProfile:
//  *   get:
//  *     tags:
//  *       - Business User
//  *     summary: 'Get Buser your Profile'
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */
// router.get("/getBuserProfile", userAuth, asyncHandler(BuserController.getBuserProfile));
// /**
//  * @swagger
//  * /v1/buser/updateBuserProfile:
//  *   put:
//  *     tags:
//  *       - Business User
//  *     summary: 'Update Profile'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "name"
//  *               about:
//  *                 type: string
//  *                 example: "about"
//  *               dob:
//  *                 type: string
//  *                 example: "2024-12-01"
//  *               gender:
//  *                 type: string
//  *                 example: "male/female"
//  *               profile_photo: 
//  *                 type: string
//  *                 format: binary  
//  *               cover_photo: 
//  *                 type: string
//  *                 format: binary  
//  *               services:
//  *                 type: string
//  *                 example: '[{"id": "122345455666777"},{"id": "122345455666777"}]'  
//  *               deleteServices:
//  *                 type: string
//  *                 example: '[{"service_id": "122345455666777"},{"service_id": "122345455666777"}]'
//  *               openinghours:
//  *                 type: string
//  *                 example: '[{"day": "monday", "starttime": "10:00", "endtime": "16:00","status":"1"},{"day": "tuesday", "starttime": "10:00", "endtime": "16:00","status":"1"}]'
//  *               deleteopeningHours:
//  *                 type: string
//  *                 example: '[{"hours_id": "65c0615a974c84a3c1979154","status":"0"},{"hours_id": "65c0615a974c84a3c1979154","status":"0"}]'
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.put("/updateBuserProfile", userAuth, imageUpload.fields([
//   { name: 'profile_photo', maxCount: 1 },
//   { name: 'cover_photo', maxCount: 1 },
// ]), asyncHandler(BuserController.updateBuserProfile));
// /**
//  * @swagger
//  * /v1/buser/getuserServices:
//  *   get:
//  *     tags:
//  *       - Business User
//  *     summary: 'Get User Services'
//  *     parameters:
//  *       - name: offset
//  *         in: query
//  *         required: false
//  *         description: for skip some data
//  *         type: number
//  *       - name: limit
//  *         in: query
//  *         description: to get limited data
//  *         required: false
//  *         type: number
//  *       - name: search
//  *         in: query
//  *         description: to get search data
//  *         required: false
//  *         type: string
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.get("/getuserServices", userAuth, asyncHandler(BuserController.getuserServices));
// /**
//  * @swagger
//  * /v1/buser/getSubCategory:
//  *   get:
//  *     tags:
//  *       - Business User
//  *     summary: 'Get Sub categories'
//  *     parameters:
//  *       - name: service_id
//  *         in: query
//  *         required: false
//  *         description: for skip some data
//  *         type: string
//  *       - name: offset
//  *         in: query
//  *         required: false
//  *         description: for skip some data
//  *         type: number
//  *       - name: limit
//  *         in: query
//  *         description: to get limited data
//  *         required: false
//  *         type: number
//  *       - name: search
//  *         in: query
//  *         description: to get search data
//  *         required: false
//  *         type: string
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.get("/getSubCategory", asyncHandler(BuserController.getSubCategory));
// /**
//  * @swagger
//  * /v1/buser/createServices:
//  *   post:
//  *     tags:
//  *       - Business User
//  *     summary: 'Create Services'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               serviceName:
//  *                 type: string
//  *                 example: "name"
//  *               price:
//  *                 type: string
//  *                 example: "name"
//  *               description:
//  *                 type: string
//  *                 example: "name"
//  *               serviceImage:
//  *                  type: array
//  *                  items:
//  *                    type: string
//  *                    format: binary
//  *               catSubcatArr:
//  *                 type: string
//  *                 example: '[{"category_id": "service1","subcategory": [{"subcategory_id": "subcategory_1"},{"subcategory_id": "subcategory_2"}]},{"category_id": "service2","subcategory": [{"subcategory_id": "subcategory2_1"},{"subcategory_id": "subcategory2_2"}]}]'
//  * 
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.post("/createServices", userAuth, imagesUpload.array("serviceImage",5), asyncHandler(BuserController.createServices));
// /**
//  * @swagger
//  * /v1/buser/getBuserAllServices:
//  *   get:
//  *     tags:
//  *       - Business User
//  *     summary: 'Get AllServices'
//  *     parameters:
//  *       - name: offset
//  *         in: query
//  *         required: false
//  *         description: for skip some data
//  *         type: number
//  *       - name: limit
//  *         in: query
//  *         description: to get limited data
//  *         required: false
//  *         type: number
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.get("/getBuserAllServices",userAuth, asyncHandler(BuserController.getBuserAllServices));
// /**
//  * @swagger
//  * /v1/buser/getSingleService:
//  *   get:
//  *     tags:
//  *       - Business User
//  *     summary: 'Get Single Services'
//  *     parameters:
//  *       - name: service_id
//  *         in: query
//  *         required: true
//  *         description: service id 65be14e1ea960df35f39a208
//  *         type: string
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.get("/getSingleService",userAuth, asyncHandler(BuserController.getSingleService));
// /**
//  * @swagger
//  * /v1/buser/updateService:
//  *   post:
//  *     tags:
//  *       - Business User
//  *     summary: 'Update Services'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               service_id:
//  *                 type: string
//  *                 required: true
//  *                 example: "65be14e1ea960df35f39a208"
//  *               serviceName:
//  *                 type: string
//  *                 example: "name"
//  *               price:
//  *                 type: string
//  *                 example: "name"
//  *               description:
//  *                 type: string
//  *                 example: "name"
//  *               serviceImage:
//  *                  type: array
//  *                  items:
//  *                    type: string
//  *                    format: binary
//  *               deletedserviceImages:
//  *                 type: string
//  *                 example: '["https://secretworld.s3.us-east-2.amazonaws.com/userprofile/1706956001572images.jpeg","https://secretworld.s3.us-east-2.amazonaws.com/userprofile/17069560015721706781841850images.jpeg","https://secretworld.s3.us-east-2.amazonaws.com/userprofile/7069560015721706781841849images.jpeg","https://secretworld.s3.us-east-2.amazonaws.com/userprofile/1706956001571favicon.png"]'
//  * 
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.post("/updateService", userAuth, imagesUpload.array("serviceImage",5), asyncHandler(BuserController.updateService));
// /**
//  * @swagger
//  * /v1/buser/deleteService:
//  *   delete:
//  *     tags:
//  *       - Business User
//  *     summary: 'Delete services'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               service_id:
//  *                 type: string
//  *                 example: "65be14e1ea960df35f39a208"
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */
// router.delete("/deleteService", userAuth, asyncHandler(BuserController.deleteService));


// /**
//  * @swagger
//  * /v1/user/updateProfile:
//  *   put:
//  *     tags:
//  *       - User Profile
//  *     summary: 'Update Profile'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "John"
//  *               lastname:
//  *                 type: string
//  *                 example: "John"
//  *               city:
//  *                 type: string
//  *                 example: "Mohali"
//  *               mobile:
//  *                 type: string
//  *                 example: "1234567890"
//  *               profileImage:
//  *                 type: string
//  *                 format: binary
//  *               about:
//  *                 type: string
//  *                 example: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
//  *               dob:
//  *                 type: date
//  *                 example: "01/04/2000"
//  *               gender:
//  *                 type: string
//  *                 example: "male"               
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.put("/updateProfile", userAuth, imageUpload.single("profileImage"), asyncHandler(userController.updateProfile));

// /**
//  * @swagger
//  * /v1/user/ProfilePictureUpload:
//  *   post:
//  *     tags:
//  *       - User Profile
//  *     summary: 'User Upload Profile Image'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               profileImage:
//  *                 type: string
//  *                 format: binary
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.post("/ProfilePictureUpload", userAuth, imageUpload.single("profileImage"), asyncHandler(userController.ProfilePictureUpload));


// /**
//  * @swagger
//  * /v1/user/deleteAccount:
//  *   delete:
//  *     tags:
//  *       - User Account Delete
//  *     summary: 'delete account'
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.delete("/deleteAccount", userAuth, asyncHandler(userController.deleteAccount));


// /**
//  * @swagger
//  * /v1/user/changePassword:
//  *   put:
//  *     tags:
//  *       - User Change Password
//  *     summary: 'Change Password'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               oldPassword:
//  *                 type: string
//  *                 example: "Your Old Password"
//  *               newPassword:
//  *                 type: string
//  *                 example: "New Password"
//  *               confirmPassword:
//  *                 type: string
//  *                 example: "Confirm Password"               
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.put("/changePassword",  userAuth, asyncHandler(userController.changePassword));

// /**
//  * @swagger
//  * /v1/user/EditUserProfile:
//  *   put:
//  *     tags:
//  *       - User Profile
//  *     summary: 'Edit or Update Profile'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         multipart/form-data:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "John"
//  *               lastname:
//  *                 type: string
//  *                 example: "John"
//  *               profileImage:
//  *                 type: string
//  *                 format: binary             
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.put("/EditUserProfile", userAuth, imageUpload.single("profileImage"), asyncHandler(userController.EditUserProfile));

// /**
//  * @swagger
//  * /v1/user/Timinglist/{userId}:
//  *   get:
//  *     tags:
//  *       - User Profile
//  *     summary: 'User timing list'
//  *     parameters:
//  *       - name: userId
//  *         in: path
//  *         description: userId
//  *         type: string
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.get("/Timinglist/:userId", asyncHandler(userController.Timinglist));

// /**
//  * @swagger
//  * /v1/user/defaultCardAndAddress:
//  *   get:
//  *     tags:
//  *       - User Profile
//  *     summary: 'default card and address'
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: OK
//  *       '400':
//  *         description: Bad Request
//  *       '401':
//  *         description: Authorization Failure
//  *       '422':
//  *         description: Validation Error
//  *       '500':
//  *         description: Internal Server Error
//  */

// router.get("/defaultCardAndAddress", userAuth, asyncHandler(userController.defaultCardAndAddress));


module.exports = router;