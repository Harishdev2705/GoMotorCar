const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../utility/config");
const { Unauthorized } = require("../utility/apiError");
const Users = require("../models/user.model");
/**
 *
 * @param {*} user
 */
const implementAuthChecks = (user, token) => {
  if (!user) {
    throw new Unauthorized("No user found");
  }
  if (user.token !== token) {
    throw new Unauthorized("you have exceeded the maximum number of active device");
  }
  if (user.isBlocked && user.role != 'admin') {
    throw new Unauthorized("User account is blocked Please contact the admin");
  }
};

/**
 *
 * @param {*} decode
 */

// const implementDecodedTokenChecks = (decode) => {
//   if (!decode) {
//     throw new Unauthorized("Authentication Failure");
//   }
//   if (decode && decode.role !== "user") {
//     throw new Unauthorized("Unauthenticated user role");
//   }
// };
const implementDecodedTokenChecks = (decode) => {
  if (!decode) {
    throw new Unauthorized("Authentication Failure");
  }
  if (decode.role !== "user" && decode.role !== "business") {
    throw new Unauthorized("Invalid user role");
  }
};


/**
 *
 * @param {*} decode
 */

const implementDecodedTokenChecksAdmin = (decode) => {
  if (!decode) {
    throw new Unauthorized("Authentication Failure");
  }
  if (decode && decode.role !== "admin") {
    throw new Unauthorized("Unauthenticated admin role");
  }
};

/**
 * @description This is the User Authentication Middleware
 * @param {Request} req - The request object
 * @param {Response} res - The reponse Object
 * @param {import("express").NextFunction} next - The next function used to pass control to next chained middleware
 */
const userAuth = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    let decode = null;
    decode = jwt.verify(token, jwtSecret);
    console.log('decode',decode);
    await implementDecodedTokenChecks(decode);

    const user = await Users.findOne(
      {
        _id: decode.id,
        role : decode.role,
      },
    );
    //console.log('user',user);
    if(user == null){
      return res.status(400).send({
        status: "false",
        statusCode: 400,
        message: "Invalid Token, please login Again",
      });
    }
    // await implementAuthChecks(user, token);

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    logger.error(e);
    if (e instanceof Unauthorized) {
      return res.status(401).send({
        status: "Unauthorized",
        statusCode: 401,
        message: e.message,
      });
    }
    return res.status(401).send({
      status: "Unauthorized",
      statusCode: 401,
      message: e.message,
    });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    let token = req.header("Authorization").replace("Bearer ", "");
    let decode = null;
    decode = jwt.verify(token, jwtSecret);

    await implementDecodedTokenChecksAdmin(decode);

    const user = await Users.findOne(
      {
        _id: decode.id,
        role : decode.role,
      },
    );
    //await implementAuthChecks(user, token);

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    logger.error(e);
    if (e instanceof Unauthorized) {
      return res.status(401).send({
        status: "Unauthorized",
        statusCode: 401,
        message: e.message,
      });
    }
    return res.status(401).send({
      status: "Unauthorized",
      statusCode: 401,
      message: e.message,
    });
  }
};

module.exports = { userAuth, adminAuth };