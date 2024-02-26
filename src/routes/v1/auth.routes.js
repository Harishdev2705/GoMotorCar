const express = require("express");
const router = express.Router();
const authController = require("../../controllers/auth.controller");
const userController = require("../../controllers/user/user.controller");
const { userAuth } = require("../../middlewares/userAuth.middleware");
const {
    signupValidation, socialLoginValidation, resendOtpValidation, setNewPasswordValidation,
    forgetPasswordValidation, LoginValidation ,verifyMobileValidation,createaccountValidation
} = require("../../validations/auth.validations");
const asyncHandler = require('../../helper/asyncHandler');
const { imageUpload } = require("../../middlewares/multerUploads");
/** @description - This route end point is for logging in */

/**
 * @swagger
 * /v1/auth/mobileloginsignup:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'User Login Signup Api'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mobile:
 *                 type: number
 *                 example: 1232123432
 *               countrycode:
 *                 type: string
 *                 example: "+91"
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */

router.post("/mobileloginsignup", verifyMobileValidation, asyncHandler(authController.mobileLoginSignup));
/** @description - Status route */


/** * @description - This route end point is for verifying the mobile of user */

/**
 * @swagger
 * /v1/auth/otpVerificationmobile:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'User Otp Verification'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 example: 3435
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */

router.post("/otpVerificationmobile",userAuth, asyncHandler(authController.otpVerificationmobile));


/**
 * @swagger
 * /v1/auth/resendOtpmobile:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'otp resend'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */

router.post("/resendOtpmobile", userAuth, asyncHandler(authController.resendOtpmobile));
/**
 * @swagger
 * /v1/auth/createAccount:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'User and business user create Account'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               usertype:
 *                 type: string
 *                 example: "user/business_user"
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               dob:
 *                 type: string
 *                 format: date
 *                 example: "2000-04-01"
 *               gender:
 *                 type: string
 *                 example: "male/female/other"
 *               profile_photo: 
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */

router.post("/createAccount", userAuth , imageUpload.single("profile_photo"), asyncHandler(authController.createAccount));

/** * @description - This route end point is for complete user account */
/**
 * @swagger
 * /v1/auth/usercompleteAccount:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'complete user account'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               about:
 *                 type: string
 *                 example: 3435
 *               interests:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: integer
 *                      example: 65b766093e3af208c7ef9329     
 *               specialization:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: integer
 *                      example: 65b783b80517bd60e3c41b21    
 *               dietary:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                      type: integer
 *                      example: 65b751a7dc151e20c62805df  
 *               place:
 *                 type: string
 *                 example: 3435
 *               lat:
 *                 type: number
 *                 example: 3435
 *               long:
 *                 type: number
 *                 example: 3435
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */
router.post("/usercompleteAccount", userAuth, asyncHandler(authController.usercompleteAccount));
/**
 * @swagger
 * /v1/auth/businessusercompleteAccount:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'business user complete Account'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               about:
 *                 type: string
 *                 example: "about"
 *               businessname:
 *                 type: string
 *                 example: "Business name"
 *               place:
 *                 type: string                
 *                 example: "mohali"
 *               lat:
 *                 type: number
 *                 example: 3435
 *               long:
 *                 type: number
 *                 example: 3435
 *               business_id: 
 *                 type: string
 *                 format: binary
 *               cover_photo: 
 *                 type: string
 *                 format: binary  
 *               services:
 *                 type: string
 *                 example: '[{"id": "122345455666777"},{"id": "122345455666777"}]'
 *               openinghours:
 *                 type: string
 *                 example: '[{"day": "monday", "starttime": "10:00", "endtime": "16:00","status":"1"},{"day": "tuesday", "starttime": "10:00", "endtime": "16:00","status":"1"}]'
 * 
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */

router.post("/businessusercompleteAccount", userAuth ,imageUpload.fields([
    { name: 'business_id', maxCount: 1 },
    { name: 'cover_photo', maxCount: 1 },
  ]), asyncHandler(authController.b_usercompleteAccount));
  /** * @description - This route end point is for complete user account */
/**
 * @swagger
 * /v1/auth/VerificationRequest:
 *   post:
 *     tags:
 *       - User Auth
 *     summary: 'Verification Request sent'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */
router.post("/VerificationRequest", userAuth, asyncHandler(authController.VerificationRequest));
/**
 * @swagger
 * /v1/auth/VerificationStatus:
 *   get:
 *     tags:
 *       - User Auth
 *     summary: 'Verification Request sent'
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: OK
 *       '400':
 *         description: Bad Request
 *       '401':
 *         description: Authorization Failure
 *       '422':
 *         description: Validation Error
 *       '500':
 *         description: Internal Server Error
 */
router.get("/VerificationStatus", userAuth, asyncHandler(authController.VerificationStatus));

// /** * @description - This route end point is for verifying the mobile of user */

// /**
//  * @swagger
//  * /v1/auth/otpVerification:
//  *   post:
//  *     tags:
//  *       - User Auth
//  *     summary: 'User Otp Verification'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               otp:
//  *                 type: string
//  *                 example: 3435
//  *               email:
//  *                 type: string
//  *                 example: jass23@gmail.com
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

// router.post("/otpVerification", asyncHandler(authController.otpVerification));
// /**
//  * @swagger
//  * /v1/auth/otpResend:
//  *   post:
//  *     tags:
//  *       - User Auth
//  *     summary: 'otp resend'
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

// router.post("/otpResend", userAuth, asyncHandler(authController.resendOtp));

// /**
//  * @swagger
//  * /v1/auth/forgotPassword:
//  *   post:
//  *     tags:
//  *       - User Auth
//  *     summary: 'forgot password'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: "admin@gmail.com"
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

// router.post("/forgotPassword", forgetPasswordValidation, asyncHandler(authController.forgotPassword));


// /**
//  * @swagger
//  * /v1/auth/login:
//  *   post:
//  *     tags:
//  *       - User Auth
//  *     summary: 'User Login Api'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: jass23@gmail.com
//  *               password:
//  *                 type: string
//  *                 example: jass@34
//  *               fcmToken:
//  *                 type: string
//  *                 example: fdsdfihifhihfih
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

// router.post("/login", LoginValidation, asyncHandler(authController.emailLogin));

// /**
// * @swagger
// * /v1/auth/sociallogin:
// *   post:
// *     tags:
// *       - User Auth
// *     summary: 'User social login Api'
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             type: object
// *             properties:
// *               socialId:
// *                 type: string
// *                 example: 9hf734hur89446ro95
// *               name:
// *                 type: string
// *                 example: gur
// *               lastname:
// *                 type: string
// *                 example: gur
// *               profileImage:
// *                 type: string
// *                 example: "https://user.png"
// *               socialType:
// *                 type: string
// *                 example: google
// *               role:
// *                 type: string
// *                 example: "user or business"
// *               email:
// *                 type: string
// *                 example: jass23@gmail.com
// *               fcmToken:
// *                 type: string
// *                 example: fdsdfihifhihfih
// *     responses:
// *       '200':
// *         description: OK
// *       '400':
// *         description: Bad Request
// *       '401':
// *         description: Authorization Failure
// *       '422':
// *         description: Validation Error
// *       '500':
// *         description: Internal Server Error
// */

// router.post("/sociallogin", socialLoginValidation, asyncHandler(authController.socialLogin));

// /** * @description - This route end point is for set new password */

// /**
//  * @swagger
//  * /v1/auth/setNewPassword:
//  *   post:
//  *     tags:
//  *       - User Auth
//  *     summary: 'Set new password"'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               token:
//  *                 type: string
//  *                 example: "token received in verify otp response"
//  *               password:
//  *                 type: string
//  *                 example: 12345678
//  *               confirmPassword:
//  *                 type: string
//  *                 example: "12345678"
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

// router.post("/setNewPassword", setNewPasswordValidation, asyncHandler(authController.setNewPassword));

// // /** * @description - This route end point is for user logout */ 

// // /**
// //  * @swagger
// //  * /v1/auth/logout:
// //  *   get:
// //  *     tags:
// //  *       - User Auth
// //  *     summary: 'Logout user'
// //  *     security:
// //  *       - bearerAuth: []
// //  *     responses:
// //  *       '200':
// //  *         description: OK
// //  *       '400':
// //  *         description: Bad Request
// //  *       '401':
// //  *         description: Authorization Failure
// //  *       '422':
// //  *         description: Validation Error
// //  *       '500':
// //  *         description: Internal Server Error
// //  */

// // router.get("/logout", userAuth, asyncHandler(userController.userLogout));

// /** @description - This route end point is for logging in */

// /**
//  * @swagger
//  * /v1/auth/updateRole:
//  *   put:
//  *     tags:
//  *       - User Auth
//  *     summary: 'Update Role'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               userId:
//  *                 type: string
//  *                 example: 64d33a6a072593e65c844d13
//  *               role:
//  *                 type: string
//  *                 example: "business or user"
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

// router.put("/updateRole", asyncHandler(authController.updateRole));



// /** * @description - This route end point is for Admin Help user */

// /**
//  * @swagger
//  * /v1/auth/adminHelpCenter:
//  *   post:
//  *     tags:
//  *       - User Help Message to Admin 
//  *     summary: 'User Help Center'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: Guddan Saini
//  *               email:
//  *                 type: string
//  *                 example: jass23@gmail.com
//  *               message:
//  *                 type: string
//  *                 example: my Product Not recive
//  *               type:
//  *                 type: string
//  *                 example: appointment or Product
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

// router.post("/adminHelpCenter", asyncHandler(authController.adminHelpCenter));


module.exports = router;