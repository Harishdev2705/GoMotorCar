const { GeneralError } = require("../utility/apiError");
const {
  BadRequestResponse,
  InternalErrorResponse,
  AccessTokenErrorResponse,
  NotFoundResponse,
  ValidationFailureErrorResponse,
} = require("../utility/apiResponse");

/**
 * @description - This is used to create a Error object from the error
 * @param {Error} err - This is the error Object
 * @return {Object} - Returns the Object with error details
 */

const createErrorObj = (err) => {
  const returnObj = {
    status: "error",
    isError: true,
    message: err.message,
  };
  if (err && err.errorObj) {
    returnObj.error = err.errorObj;
  }
  return returnObj;
};

/**
 * @description This function is used for handling the error and sending the response
 * @param {Error} err - This is the error Object
 * @param {Request} req - The request object
 * @param {Response} res - The reponse Object
 * @param {import("express").NextFunction} next - The next function used to pass control to next chained middleware
 */

const handleErrors = (err, req, res, next) => {
  if (err instanceof GeneralError) {
    let code = err.getCode();
    let errorObject = createErrorObj(err);

    switch (code) {
      case 400:
        return new BadRequestResponse(err.message, errorObject).send(res);

      case 404:
        return new NotFoundResponse(err.message, errorObject).send(res);

      case 401:
        return new AccessTokenErrorResponse(
          "Access token Unauthorized",
          errorObject
        ).send(res);

      case 422:
        return new ValidationFailureErrorResponse(
          "Validation error",
          errorObject
        ).send(res);

      default:
        return new InternalErrorResponse(err.message, errorObject).send(res);
    }
  }
  return res.status(500).json({
    status:"error",
    isError: true,
    message: err.message,
  })
};

module.exports = handleErrors;
