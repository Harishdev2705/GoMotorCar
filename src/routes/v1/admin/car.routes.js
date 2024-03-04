const express = require("express");
const router = express.Router();
// const AdminAuthController = require("../../../controllers/admin/auth.controller");
const AdminCarController = require("../../../controllers/admin/car.controller");
const {
    signupValidation, LoginValidation
} = require("../../../validations/auth.validations");
const asyncHandler = require('../../../helper/asyncHandler');
const { adminAuth } = require("../../../middlewares/userAuth.middleware");
const { imageUpload } = require("../../../middlewares/multerUploads");


/**
 * @swagger
 * /v1/admin/car/Addcar:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'Add car'
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
 *                 example: "BMW"
 *               carImage:
 *                 type: file
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

router.post("/Addcar", imageUpload.single("carImage"), asyncHandler(AdminCarController.Addcar));

/**
 * @swagger
 * /v1/admin/car/cars:
 *   get:
 *     tags:
 *       - Admin Auth
 *     summary: 'Get Cars'   
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

router.get("/cars", asyncHandler(AdminCarController.cars));
/**
 * @swagger
 * /v1/admin/car/AddcarModel:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'add car Model'
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               carID:
 *                 type: integer
 *                 example: 65b783b80517bd60e3c41b21
 *               name:
 *                 type: string
 *                 example: "BMW"
 *               carImage:
 *                 type: file
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

router.post("/AddcarModel", imageUpload.single("carImage"), asyncHandler(AdminCarController.AddcarModel));
/**
 * @swagger
 * /v1/admin/car/carsModel:
 *   get:
 *     tags:
 *       - Admin Auth
 *     summary: 'Get car model'
 *     parameters:
 *       - name: carID
 *         in: query
 *         required: false
 *         description: for get data
 *         type: number
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

router.get("/carsModel",  asyncHandler(AdminCarController.carsModel));

/**
 * @swagger
 * /v1/admin/car/AddCarCategory:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'Admin car Category Api'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sedan/SUV"   
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

router.post("/AddCarCategory", asyncHandler(AdminCarController.AddCarCategory));
/**
 * @swagger
 * /v1/admin/car/CarCategories:
 *   get:
 *     tags:
 *       - Admin Auth
 *     summary: 'Get Car Categories'   
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

router.get("/CarCategories",asyncHandler(AdminCarController.CarCategories));
/**
 * @swagger
 * /v1/admin/car/AddFuelType:
 *   post:
 *     tags:
 *       - Admin Auth
 *     summary: 'Add fuel type'
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
 *                 example: "BMW"
 *               Image:
 *                 type: file
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

router.post("/AddFuelType", imageUpload.single("Image"), asyncHandler(AdminCarController.AddFuelType));
/**
 * @swagger
 * /v1/admin/car/Fueltype:
 *   get:
 *     tags:
 *       - Admin Auth
 *     summary: 'Get fuel type'   
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

router.get("/Fueltype",asyncHandler(AdminCarController.Fueltype));


/**
 * @swagger
 * /v1/admin/car/AddtransmissionType:
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
 *               name:
 *                 type: string
 *                 example: "auto"           
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

router.post("/AddtransmissionType", asyncHandler(AdminCarController.AddtransmissionType));

/**
 * @swagger
 * /v1/admin/car/transmissionType:
 *   get:
 *     tags:
 *       - Admin Auth
 *     summary: 'Get transmission Type'   
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

router.get("/transmissionType",asyncHandler(AdminCarController.transmissionType));


// /** @description - This route end point is for logging in */

// /**
//  * @swagger
//  * /v1/admin/auth/login:
//  *   post:
//  *     tags:
//  *       - Admin Auth
//  *     summary: 'Admin Login Api'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               email:
//  *                 type: string
//  *                 example: secretworldadmin@yopmail.com
//  *               password:
//  *                 type: string
//  *                 example: 12345
//  *               fcmToken:
//  *                 type: string
//  *                 example: for ios,android and web
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

// router.post("/login", LoginValidation, asyncHandler(AdminAuthController.emailLogin));

// /**
//  * @swagger
//  * /v1/admin/auth/forgotPassword:
//  *   post:
//  *     tags:
//  *       - Admin Auth
//  *     summary: 'forgot password'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               emailOrPhone:
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

// router.post("/forgotPassword",  asyncHandler(AdminAuthController.forgotPassword));


// /**
//  * @swagger
//  * /v1/admin/auth/forgetPasswordOtpVerify:
//  *   post:
//  *     tags:
//  *       - Admin Auth
//  *     summary: 'User Mobile Otp And Email Otp Verification'
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

// router.post("/forgetPasswordOtpVerify", asyncHandler(AdminAuthController.forgetPasswordOtpVerify));


// /**
//  * @swagger
//  * /v1/admin/auth/otpResend:
//  *   post:
//  *     tags:
//  *       - Admin Auth
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

// router.post("/otpResend", adminAuth, asyncHandler(AdminAuthController.resendOtp));






// /** * @description - This route end point is for set new password */

// /**
//  * @swagger
//  * /v1/admin/auth/setNewPassword:
//  *   post:
//  *     tags:
//  *       - Admin Auth
//  *     summary: 'Create new password'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
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

// router.post("/setNewPassword", adminAuth, asyncHandler(AdminAuthController.setNewPassword));



// /**
//  * @swagger
//  * /v1/admin/auth/updateProfile:
//  *   put:
//  *     tags:
//  *       - Admin Auth
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
//  *               mobile:
//  *                 type: string
//  *                 example: "1234567890"
//  *               profile_photo:
//  *                 type: file
//  *                 format: binary
//  *               about:
//  *                 type: string
//  *                 example: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."              
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

// router.put("/updateProfile", adminAuth, imageUpload.single("profile_photo"), asyncHandler(AdminAuthController.updateProfile));


module.exports = router;