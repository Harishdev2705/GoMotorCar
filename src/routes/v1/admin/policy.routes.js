const express = require("express");
const router = express.Router();
const { adminAuth } = require("../../../middlewares/userAuth.middleware");
const asyncHandler = require('../../../helper/asyncHandler')
const PolicyController = require("../../../controllers/admin/policy.controller");


// /**
//  * @swagger
//  * /v1/admin/policy/createPolicyTerms:
//  *   post:
//  *     tags:
//  *       - Admin Policy Terms
//  *     summary: 'Create Policy Terms'
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
//  *                 example: "policy or about"
//  *               content:
//  *                 type: string
//  *                 example: "this is content"
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

// router.post("/createPolicyTerms", adminAuth, asyncHandler(PolicyController.createPolicyTerms));


// /**
//  * @swagger
//  * /v1/admin/policy/getPolicyTerms/{type}:
//  *   get:
//  *     tags:
//  *       -  Admin Policy Terms
//  *     summary: 'Get Policy Terms'
//  *     parameters:
//  *       - name: type
//  *         in: path
//  *         description: type
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

// router.get("/getPolicyTerms/:type", asyncHandler(PolicyController.getPolicyTerms));


module.exports = router;