const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/user/user.controller");
const { userAuth } = require("../../../middlewares/userAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler');
const { updateProfileValidation, updateUnitAndNotificationValidation, addMonyToWalletValidation } = require("../../../validations/user.validations");
const { imageUpload } = require("../../../middlewares/multerUploads");

// /**
//  * @swagger
//  * /v1/user/getProfile:
//  *   get:
//  *     tags:
//  *       - User 
//  *     summary: 'Get get Profile'
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

// router.get("/getProfile", userAuth, asyncHandler(userController.getProfile));
// /**
//  * @swagger
//  * /v1/user/getUserProfile:
//  *   get:
//  *     tags:
//  *       - User 
//  *     summary: 'Get get user Profile'
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

// router.get("/getUserProfile", userAuth, asyncHandler(userController.getUserProfile));

// /**
//  * @swagger
//  * /v1/user/updateUserProfile:
//  *   put:
//  *     tags:
//  *       - User
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
//  *               interests:
//  *                 type: string
//  *                 example: '[{"id": "122345455666777"},{"id": "122345455666777"}]'  
//  *               deleteInterests:
//  *                 type: string
//  *                 example: '[{"interests_id": "122345455666777"},{"interests_id": "122345455666777"}]'
//  *               specialization:
//  *                 type: string
//  *                 example: '[{"id": "122345455666777"},{"id": "122345455666777"}]'  
//  *               deleteSpecialization:
//  *                 type: string
//  *                 example: '[{"specialization_id": "122345455666777"},{"specialization_id": "122345455666777"}]'
//  *               dietary:
//  *                 type: string
//  *                 example: '[{"id": "122345455666777"},{"id": "122345455666777"}]'  
//  *               deleteDietary:
//  *                 type: string
//  *                 example: '[{"dietary_id": "122345455666777"},{"dietary_id": "122345455666777"}]'
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
// router.put("/updateUserProfile", userAuth, imageUpload.single("profileImage"), asyncHandler(userController.updateUserProfile));

// /**
//  * @swagger
//  * /v1/user/myProfile:
//  *   get:
//  *     tags:
//  *       - User Profile
//  *     summary: 'Get my profile details'
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

// router.get("/myProfile", userAuth, asyncHandler(userController.myProfileDetails));

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