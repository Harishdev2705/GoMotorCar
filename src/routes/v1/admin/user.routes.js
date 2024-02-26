const express = require("express");
const router = express.Router();
const userController = require("../../../controllers/admin/user.controller");
const userFunctions = require("../../../controllers/admin/userfunctions.controller");
const { adminAuth } = require("../../../middlewares/userAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler');
const {
  getuserfunctionslistValidation,createuserfunctionslistValidation,createserviceslistValidation,updateservicesValidation,updatefunctionslistValidation,createsubserviceslistValidation
} = require("../../../validations/user.validations");

// /**
//  * @swagger
//  * /v1/admin/user/getUserList?type&&offset&&limit:
//  *   get:
//  *     tags:
//  *       -  Admin User
//  *     summary: 'Get User'
//  *     parameters:
//  *       - name: type
//  *         in: query
//  *         required: false
//  *         description: for skip some data
//  *         type: number
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

// router.get("/getUserList", adminAuth, asyncHandler(userController.getUserList));

// /**
//  * @swagger
//  * /v1/admin/user/getUserDetails/{id}:
//  *   get:
//  *     tags:
//  *       -  Admin User 
//  *     summary: 'Get user query details'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id 
//  *         in: path   
//  *         description: id
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

// router.get("/getUserDetails/:id", adminAuth, asyncHandler(userController.getUserDetails));
// /**
//  * @swagger
//  * /v1/admin/user/deleteUser/{id}:
//  *   delete:
//  *     tags:
//  *       -  Admin User 
//  *     summary: 'Get user query details'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id 
//  *         in: path   
//  *         description: id
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

// router.delete("/deleteUser/:id", adminAuth, asyncHandler(userController.deleteUser));

// /**
//  * @swagger
//  * /v1/admin/user/getVerificationsRequests?type&&offset&&limit:
//  *   get:
//  *     tags:
//  *       -  Admin User
//  *     summary: 'Get Verifications Requests'
//  *     parameters:
//  *       - name: type
//  *         in: query
//  *         required: false
//  *         description: for skip some data
//  *         type: number
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

// router.get("/getVerificationsRequests", adminAuth, asyncHandler(userController.getVerificationsRequests));

// /** @description - This route end point is for verify Unverify account */

// /**
//  * @swagger
//  * /v1/admin/user/verifyUnverifyuser:
//  *   post:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Admin account verify Unverify Api'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: 643e230a625477a83b19cd24
//  *               status:
//  *                 type: boolean
//  *                 example: false
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

// router.post("/verifyUnverifyuser", adminAuth, asyncHandler(userController.verifyUnverifyuser));

// /**
//  * @swagger
//  * /v1/admin/user/createfunctions_list:
//  *   post:
//  *     tags:
//  *       - Admin User
//  *     summary: 'create functions list'
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
//  *                 example: "Interests"
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

// router.post("/createfunctions_list", adminAuth, asyncHandler(userFunctions.createfunctions_list));
// /**
//  * @swagger
//  * /v1/admin/user/create_user_functions:
//  *   post:
//  *     tags:
//  *       - Admin User 
//  *     summary: 'Post user functions'
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
//  *                 example: "games"
//  *               type:
//  *                 type: string
//  *                 example: "intrests"
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

// router.post("/create_user_functions",createuserfunctionslistValidation, adminAuth, asyncHandler(userFunctions.create_user_functions));
// /**
//  * @swagger
//  * /v1/admin/user/functions_type_list:
//  *   get:
//  *     tags:
//  *       - Admin User 
//  *     summary: 'Get functions type'
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

// router.get("/functions_type_list", asyncHandler(userFunctions.functions_type_list));
// /**
//  * @swagger
//  * /v1/admin/user/usersfunctions_list:
//  *   post:
//  *     tags:
//  *       - Admin User 
//  *     summary: 'Get users functions list'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               type:
//  *                 type: string
//  *                 example: "Interests/Specialization/Dietary Preferences"
//  *               offset:
//  *                 type: number
//  *                 example: "1"
//  *               limit:
//  *                 type: number
//  *                 example: "20"
//  *               search:
//  *                 type: string
//  *                 example: "Interests"
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

// router.post("/usersfunctions_list",getuserfunctionslistValidation,  asyncHandler(userFunctions.usersfunctions_list));
// /**
//  * @swagger
//  * /v1/admin/user/getSingleusersfunction?id:
//  *   get:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Get single user function'
//  *     parameters:
//  *       - name: id
//  *         in: query
//  *         required: false
//  *         description: function id
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

// router.get("/getSingleusersfunction",adminAuth, asyncHandler(userFunctions.getSingleusersfunction));
// /**
//  * @swagger
//  * /v1/admin/user/updateusersfunctions:
//  *   put:
//  *     tags:
//  *       - Admin User 
//  *     summary: 'Update users functions list'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: "65b74d035863d47d601a47ad"
//  *               name:
//  *                 type: string
//  *                 example: "games"
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

// router.put("/updateusersfunctions",updatefunctionslistValidation,  asyncHandler(userFunctions.updateusersfunctions));
// /**
//  * @swagger
//  * /v1/admin/user/deleteusersfunctions:
//  *   delete:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Delete users functions'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: "65bb19832567c39ea874b904"
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

// router.delete("/deleteusersfunctions", adminAuth, asyncHandler(userFunctions.deleteusersfunctions));

// /**
//  * @swagger
//  * /v1/admin/user/createservices:
//  *   post:
//  *     tags:
//  *       - Admin User
//  *     summary: 'create services'
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
//  *                 example: "Hair color"
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

// router.post("/createservices",createserviceslistValidation, adminAuth, asyncHandler(userFunctions.createServices));
// /**
//  * @swagger
//  * /v1/admin/user/createSubServices:
//  *   post:
//  *     tags:
//  *       - Admin User
//  *     summary: 'create sub services'
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
//  *                 example: "Hair color"
//  *               service_id:
//  *                 type: string
//  *                 example: "65bb19832567c39ea874b904"
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

// router.post("/createSubServices",createsubserviceslistValidation, adminAuth, asyncHandler(userFunctions.createSubServices));

// /**
//  * @swagger
//  * /v1/admin/user/getServices?offset&&limit:
//  *   get:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Get Services'
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

// router.get("/getServices", asyncHandler(userFunctions.getServices));
// /**
//  * @swagger
//  * /v1/admin/user/getsubServices?offset&&limit:
//  *   get:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Get Services'
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

// router.get("/getsubServices", asyncHandler(userFunctions.getsubServices));

// /**
//  * @swagger
//  * /v1/admin/user/getOneServices?id:
//  *   get:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Get Services'
//  *     parameters:
//  *       - name: id
//  *         in: query
//  *         required: false
//  *         description: services id
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

// router.get("/getOneServices",adminAuth, asyncHandler(userFunctions.getOneServices));
// /**
//  * @swagger
//  * /v1/admin/user/getOnesubServices?id:
//  *   get:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Get Sub Services'
//  *     parameters:
//  *       - name: id
//  *         in: query
//  *         required: false
//  *         description: services id
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

// router.get("/getOnesubServices",adminAuth, asyncHandler(userFunctions.getOnesubServices));

// /**
//  * @swagger
//  * /v1/admin/user/updateServices:
//  *   put:
//  *     tags:
//  *       - Admin User
//  *     summary: 'update services'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: "65bb19832567c39ea874b904"
//  *               name:
//  *                 type: string
//  *                 example: "Hair color"
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

// router.put("/updateServices", adminAuth, asyncHandler(userFunctions.updateServices));

// /**
//  * @swagger
//  * /v1/admin/user/updateSubServices:
//  *   put:
//  *     tags:
//  *       - Admin User
//  *     summary: 'update Sub services'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: "65bb19832567c39ea874b904"
//  *               name:
//  *                 type: string
//  *                 example: "Hair color"
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

// router.put("/updateSubServices", adminAuth, asyncHandler(userFunctions.updateSubServices));

// /**
//  * @swagger
//  * /v1/admin/user/deleteServices:
//  *   delete:
//  *     tags:
//  *       - Admin User
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
//  *               id:
//  *                 type: string
//  *                 example: "65bb19832567c39ea874b904"
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

// router.delete("/deleteServices", adminAuth, asyncHandler(userFunctions.deleteServices));
// /**
//  * @swagger
//  * /v1/admin/user/deletesubServices:
//  *   delete:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Delete sub services'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: "65bb19832567c39ea874b904"
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

// router.delete("/deletesubServices", adminAuth, asyncHandler(userFunctions.deletesubServices));



// /** @description - This route end point is for logging in */

// /**
//  * @swagger
//  * /v1/admin/user/accountBlockUnBlock:
//  *   post:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Admin account block unblock Api'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: 643e230a625477a83b19cd24
//  *               status:
//  *                 type: boolean
//  *                 example: false
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

// router.post("/accountBlockUnBlock", adminAuth, asyncHandler(userController.accountBlockUnBlock));


// /**
//  * @swagger
//  * /v1/admin/user/deleteAccount/{id}:
//  *   delete:
//  *     tags:
//  *       -  Admin User
//  *     summary: 'delete user details'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: id
//  *         in: path
//  *         description: id 
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

// router.delete("/deleteAccount/:id", adminAuth, asyncHandler(userController.deleteAccount));

// /**
//  * @swagger
//  * /v1/admin/user/deleteAllUser:
//  *   delete:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Delete All User'
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

// router.delete("/deleteAllUser", asyncHandler(userController.deleteAllUser));


// /**
//  * @swagger
//  * /v1/admin/user/deleteAllOrderReviewAppoi:
//  *   delete:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Delete All User'
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

// router.delete("/deleteAllOrderReviewAppoi", asyncHandler(userController.deleteAllOrderReviewAppoi));


// /**
//  * @swagger
//  * /v1/admin/user/accountApproved:
//  *   post:
//  *     tags:
//  *       - Admin User
//  *     summary: 'Admin account approve Api'
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               id:
//  *                 type: string
//  *                 example: 643e230a625477a83b19cd24
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

// router.post("/accountApproved", adminAuth, asyncHandler(userController.accountApproved));


module.exports = router;