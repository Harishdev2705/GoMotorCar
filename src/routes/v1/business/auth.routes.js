const express = require("express");
const router = express.Router();
const businessController = require("../../../controllers/business/business.controller");
const { businessAuth } = require("../../../middlewares/businessAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler');
// const { businessSignupValidation } = require("../../../validations/business.validations");

// /**
//  * @swagger
//  * /v1/auth/businessSignup:
//  *   post:
//  *     tags:
//  *       - Business Auth
//  *     summary: 'Business SignUp'
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               firstname:
//  *                 type: string
//  *                 example: "John"
//  *               lastname:
//  *                 type: string
//  *                 example: "doe"
//  *               email:
//  *                 type: string
//  *                 example: johndeo@gmail.com
//  *               password:
//  *                 type: string
//  *                 example: 12345678
//  *               countryId:
//  *                 type: string
//  *                 example: 91
//  *               mobile:
//  *                 type: string
//  *                 example: 9856231478
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

// router.post("/businessSignup", asyncHandler(businessController.businessSignup));

// /**
//  * @swagger
//  * /v1/auth/signUpMoreInfo:
//  *   put:
//  *     tags:
//  *       - Business Auth
//  *     summary: 'Business SignUp More Info'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               businessName:
//  *                 type: string
//  *                 example: "John"
//  *               profileImage:
//  *                 type: string
//  *                 example: "doe"
//  *               city:
//  *                 type: string
//  *                 example: "test city"
//  *               address:
//  *                 type: string
//  *                 example: "test address"
//  *               state:
//  *                 type: string
//  *                 example: "test state"
//  *               zip:
//  *                 type: string
//  *                 example: "test zip"
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

// router.put("/signUpMoreInfo",businessAuth,  asyncHandler(businessController.signUpMoreInfo));

// /**
//  * @swagger
//  * /v1/auth/getUserContact:
//  *   get:
//  *     tags:
//  *       - Business Contact 
//  *     summary: 'Get user for business client'
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

// router.get("/getUserContact", businessAuth, asyncHandler(businessController.getUserContact));

// /**
//  * @swagger
//  * /v1/auth/getUserContactByBusinessID:
//  *   get:
//  *     tags:
//  *       - Business Contact 
//  *     summary: 'Get user for business by id client'
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

// router.get("/getUserContactByBusinessID", businessAuth, asyncHandler(businessController.getUserContactByBusinessID));

// /**
//  * @swagger
//  * /v1/auth/CreateUserContact:
//  *   post:
//  *     tags:
//  *       - Business Contact
//  *     summary: 'Create New Client'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               name:
//  *                 type: string
//  *                 example: "John"
//  *               email:
//  *                 type: string
//  *                 example: johndeo@gmail.com
//  *               mobile:
//  *                 type: string
//  *                 example: 123456785
//  *               address:
//  *                 type: string
//  *                 example: "address name"
//  *               city:
//  *                 type: string
//  *                 example: "city name"
//  *               state:
//  *                 type: string
//  *                 example: "state name"
//  *               zip:
//  *                 type: string
//  *                 example: "246763"
//  *               dob:
//  *                 type: string
//  *                 example: "24-03-1999"
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

// router.post("/CreateUserContact", businessAuth, asyncHandler(businessController.CreateUserContact));

// /**
//  * @swagger
//  * /v1/auth/createNewAppointment:
//  *   post:
//  *     tags:
//  *       - Business Contact
//  *     summary: 'Appointment Create'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               data:
//  *                 type: object
//  *                 example: [{  "serviceId": "642d0bb29daf22457f18685f", "userId": "642d0bb29daf22457f18685f", "date": "2023-06-30", "time": "01:00 PM",  "timeDuration": "15 minutes", "notes": "Lorem Ipsum", "title": "This is service name custom", "serviceType": "3 = client and 2 = personal", "totalAmount": "369"  }]
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

// router.post("/createNewAppointment", businessAuth, asyncHandler(businessController.createNewAppointment));




// /**
//  * @swagger
//  * /v1/auth/getUserContactSearch?nameAndPhone:
//  *   get:
//  *     tags:
//  *       - Business Contact 
//  *     summary: 'Get user for business client search'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: nameAndPhone
//  *         in: query
//  *         required: false
//  *         description: name or phone
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

// router.get("/getUserContactSearch", businessAuth, asyncHandler(businessController.getUserContactSearch));

// /**
//  * @swagger
//  * /v1/auth/getUserContactDetails/{id}:
//  *   get:
//  *     tags:
//  *       - Business Contact 
//  *     summary: 'Get Client Details'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: client id
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

// router.get("/getUserContactDetails/:id", businessAuth, asyncHandler(businessController.getUserContactDetails));

// /**
//  * @swagger
//  * /v1/auth/deleteContactUser/{id}:
//  *   delete:
//  *     tags:
//  *       - Business Contact 
//  *     summary: 'Delete Client Details'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: client id
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

// router.delete("/deleteContactUser/:id", businessAuth, asyncHandler(businessController.deleteContactUser));


module.exports = router;