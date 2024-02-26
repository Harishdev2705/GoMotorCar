const express = require("express");
const router = express.Router();
const AdminAuthController = require("../../../controllers/admin/auth.controller");
const {
    signupValidation, LoginValidation
} = require("../../../validations/auth.validations");
const asyncHandler = require('../../../helper/asyncHandler');
const { adminAuth } = require("../../../middlewares/userAuth.middleware");
const { imageUpload } = require("../../../middlewares/multerUploads");


/**
 * @swagger
 * /v1/admin/auth/signUp:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'Admin signUp'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "secret world"
 *               email:
 *                 type: string
 *                 example: admin@gmail.com
 *               password:
 *                 type: string
 *                 example: 12345
 *               fcmToken:
 *                 type: string
 *                 example: for ios,android and web
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

router.post("/signup", asyncHandler(AdminAuthController.signup));

/** @description - This route end point is for logging in */

/**
 * @swagger
 * /v1/admin/auth/login:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'Admin Login Api'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: secretworldadmin@yopmail.com
 *               password:
 *                 type: string
 *                 example: 12345
 *               fcmToken:
 *                 type: string
 *                 example: for ios,android and web
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

router.post("/login", LoginValidation, asyncHandler(AdminAuthController.emailLogin));

/**
 * @swagger
 * /v1/admin/auth/forgotPassword:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'forgot password'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emailOrPhone:
 *                 type: string
 *                 example: "admin@gmail.com"
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

router.post("/forgotPassword",  asyncHandler(AdminAuthController.forgotPassword));


/**
 * @swagger
 * /v1/admin/auth/forgetPasswordOtpVerify:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'User Mobile Otp And Email Otp Verification'
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

router.post("/forgetPasswordOtpVerify", asyncHandler(AdminAuthController.forgetPasswordOtpVerify));


/**
 * @swagger
 * /v1/admin/auth/otpResend:
 *   post:
 *     tags:
 *       - Admin Auth
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

router.post("/otpResend", adminAuth, asyncHandler(AdminAuthController.resendOtp));






/** * @description - This route end point is for set new password */

/**
 * @swagger
 * /v1/admin/auth/setNewPassword:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'Create new password'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: 12345678
 *               confirmPassword:
 *                 type: string
 *                 example: "12345678"
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

router.post("/setNewPassword", adminAuth, asyncHandler(AdminAuthController.setNewPassword));



/**
 * @swagger
 * /v1/admin/auth/updateProfile:
 *   put:
 *     tags:
 *       - Admin Auth
 *     summary: 'Update Profile'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John"
 *               mobile:
 *                 type: string
 *                 example: "1234567890"
 *               profile_photo:
 *                 type: file
 *                 format: binary
 *               about:
 *                 type: string
 *                 example: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."              
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

router.put("/updateProfile", adminAuth, imageUpload.single("profile_photo"), asyncHandler(AdminAuthController.updateProfile));


module.exports = router;