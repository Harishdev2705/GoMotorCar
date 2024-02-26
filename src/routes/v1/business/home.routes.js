

const express = require("express");
const router = express.Router();
const homeController = require("../../../controllers/business/home.controller");
const { businessAuth } = require("../../../middlewares/businessAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler');

// /**
//  * @swagger
//  * /v1/business/home/myhomePage:
//  *   get:
//  *     tags:
//  *       - Business Home Page 
//  *     summary: 'Home Page'
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

// router.get("/myhomePage", businessAuth, asyncHandler(homeController.myhomePage));
// // -----------------       

// /**
//  * @swagger
//  * /v1/business/home/getProfession:
//  *   get:
//  *     tags:
//  *       - Business Profession
//  *     summary: 'Business Profession'
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

// router.get("/getProfession", businessAuth, asyncHandler(homeController.getProfession));

// /**
//  * @swagger
//  * /v1/business/home/getProfessionWeb:
//  *   get:
//  *     tags:
//  *       - Business Profession
//  *     summary: 'Business Profession Web'
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

// router.get("/getProfessionWeb", asyncHandler(homeController.getProfessionWeb));


// /**
//  * @swagger
//  * /v1/business/home/getSpecialist/{professionId}:
//  *   get:
//  *     tags:
//  *       -  Business Specialist
//  *     summary: 'Business Specialist'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: professionId
//  *         in: path
//  *         description: profession name
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

// router.get("/getSpecialist/:professionId", businessAuth, asyncHandler(homeController.getSpecialist));


// /**
//  * @swagger
//  * /v1/business/home/getTemplate/{specialistId}:
//  *   get:
//  *     tags:
//  *       -  Business Template
//  *     summary: 'Business Template'
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - name: specialistId
//  *         in: path
//  *         description: specialist Id
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

// router.get("/getTemplate/:specialistId", businessAuth, asyncHandler(homeController.getTemplate));


// // -----------



 module.exports = router;

