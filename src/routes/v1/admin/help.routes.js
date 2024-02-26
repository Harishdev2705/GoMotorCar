const express = require("express");
const router = express.Router();
const { adminAuth } = require("../../../middlewares/userAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler')
const HelpController = require("../../../controllers/admin/help.controller");


/**
 * @swagger
 * /v1/admin/help/createHelp:
 *   post:
 *     tags:
 *       - Admin Help Center
 *     summary: 'Create Help'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "user or business_user"
 *               question:
 *                 type: string
 *                 example: "create question"
 *               answer:
 *                 type: string
 *                 example: "create answer"
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

router.post("/createHelp", adminAuth, asyncHandler(HelpController.createHelp));


/**
 * @swagger
 * /v1/admin/help/getallHelp/{type}:
 *   get:
 *     tags:
 *       -  Admin Help Center
 *     summary: 'Get Help'
 *     parameters:
 *       - name: type
 *         in: path
 *         description: type
 *         type: string
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

router.get("/getallHelp/:type", asyncHandler(HelpController.getallHelp));


/**
 * @swagger
 * /v1/admin/help/gethelpDetails/{id}:
 *   get:
 *     tags:
 *       -  Admin Help Center 
 *     summary: 'Get Help details'
 *     parameters:
 *       - name: id 
 *         in: path   
 *         description: id
 *         type: string
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

router.get("/gethelpDetails/:id",  asyncHandler(HelpController.gethelpDetails));

/**
 * @swagger
 * /v1/admin/help/updateHelp:
 *   put:
 *     tags:
 *       - Admin Help Center 
 *     summary: 'Update Help'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "642d0bb29daf22457f18685f"
 *               question:
 *                 type: string
 *                 example: "update ques"
 *               answer:
 *                 type: string
 *                 example: "update ans"
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

router.put("/updateHelp", adminAuth, asyncHandler(HelpController.updateHelp));
/**
 * @swagger
 * /v1/admin/help/deleteHelp:
 *   delete:
 *     tags:
 *       - Admin Help Center 
 *     summary: 'delete Help'
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 example: "642d0bb29daf22457f18685f"
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

router.delete("/deleteHelp", adminAuth, asyncHandler(HelpController.deleteHelp));


// /**
//  * @swagger
//  * /v1/admin/help/getallHelp:
//  *   get:
//  *     tags:
//  *       - Admin Help Center 
//  *     summary: 'Get query'
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

// router.get("/getallHelp",  asyncHandler(HelpController.getallHelp));


module.exports = router;