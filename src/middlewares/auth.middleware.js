const { decodeToken } = require("../helper/common");

/**
 * @description This is the User Authentication Middleware
 * @param {Request} req - The request object
 * @param {Response} res - The reponse Object
 * @param {import("express").NextFunction} next - The next function used to pass control to next chained middleware
 */
const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    const decode = decodeToken(token);
    req.token = token;
    req.decoded = decode;
    next();
  } catch (e) {
    logger.error(e);
    return res.status(401).send({
      status: "Unauthorized",
      statusCode: 401,
      message: e.message,
    });
  }
};

module.exports = { authMiddleware };
