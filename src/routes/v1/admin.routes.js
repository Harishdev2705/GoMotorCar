const express = require("express");
const router = express.Router();
const { userAuth, adminAuth } = require("../../middlewares/userAuth.middleware");
const asyncHandler = require('../../helper/asyncHandler')
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const path = require("path")
const { options } = require("../../utility/config");


/*** @description GET v1/status   --------    */

router.get("/status", (req, res) => res.send("OK"));

/*** @description Admin route methods   */

const specs = swaggerJsdoc(options);

/*** @description - The route end Point for the api-docs */

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

/** * @description - this route is for admin login */


module.exports = router;