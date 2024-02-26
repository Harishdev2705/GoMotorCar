const { ValidationFailure } = require("../utility/apiError");
const {
    check,
    header,
    body,
    query,
    param,
    validationResult,
} = require("express-validator");

/**
 * @description - This validation used for signup validation
 */
const signupValidation = [
    body("firstname", "firstname is required.")
        .exists()
        .notEmpty(),
    body("lastname", "firstname is required.")
        .exists()
        .notEmpty()
        .withMessage("Name is required."),
    body("email", "email is required.")
        .exists()
        .notEmpty()
        .withMessage("Email is required"),
    body("fcmToken", "fcmToken is required.")
        .exists()
        .notEmpty()
        .withMessage("fcmToken is required"),
    body("password", "password is required.")
        .exists()
        .notEmpty()
        .withMessage("Password is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the signup validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];


/**
 * @description - This validation used for verify login otp
 */
const verifyMobileValidation = [
    body("Fullname", "Fullname is required.")
    .exists()
    .withMessage("Valid Fullname is required."),
    body("mobile", "mobile is required.")
        .exists()
        .withMessage("Valid Mobile is required."),
    body("countrycode", "CountryCode is required.")
        .exists()
        .matches(/^\+\d+$/)
        .withMessage("CountryCode is required with + prefix"),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the mobile verify validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];

/**
 * @description - This validation used for verify login otp
 */
const verifyLoginOtpValidation = [
    body("mobile", "mobile is required.")
        .exists()
        .withMessage("Valid Mobile is required."),
    body("mobileCountryCode", "mobileCountryCode is required.")
        .exists()
        .matches(/^\+\d+$/)
        .withMessage("mobileCountryCode is required with + prefix"),
    body("otp", "otp is required.")
        .exists()
        .withMessage("Valid Otp is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the mobile verify validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];

/**
 * @description - This validation used for social login
 */
const socialLoginValidation = [
    body("socialType", "socialType is required.")
        .exists()
        .withMessage("socialType is required."),
    body("email", "email is required.")
        .exists()
        .withMessage("email is required."),
    body("name", "name is required.")
        .exists()
        .withMessage("name is required."),
    body("socialId", "socialId is required.")
        .exists()
        .withMessage("socialId is required."),
    body("fcmToken", "fcmToken is required.")
        .exists()
        .withMessage("fcmToken is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the social login validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];


/**
 * @description - This validation used for verify resend otp
 */
const resendOtpValidation = [
    body("type", "type is required.")
        .exists()
        .withMessage("Valid type is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the resend otp validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];


/**
 * @description - This validation used for forget password
 */
 const forgetPasswordValidation = [
    body("email", "email is required.")
        .exists()
        .withMessage("email is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the forget password validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];


/**
 * @description - This validation used for social login
 */
const LoginValidation = [

    body("email", "email is required.")
        .exists()
        .withMessage("email is required."),
    body("password", "password is required.")
        .exists()
        .withMessage("password is required."),
    body("fcmToken", "fcmToken is required.")
        .exists()
        .withMessage("fcmToken is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the login validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];


/**
 * @description - This validation used for verify forget password otp 
 */
const verifyForgetPasswordOtpValidation = [
    body("email", "email is required.")
      .exists()
      .withMessage("email is required."),
    body("otp", "otp is required.")
        .exists()
        .isLength({ min: 4, max: 8 })
        .withMessage("Valid Otp is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the verify forget password otp validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];
/**
 * @description - This validation used for create account
 */
const createaccountValidation = [
    body("usertype", "usertype is required.")
      .exists()
      .withMessage("usertype is required."),
    body("fullname", "fullname is required.")
        .exists()
        .withMessage("fullname is required."),
    body("dob", "dob is required.")
        .exists()
        .withMessage("dob is required."),
    body("gender", "gender is required.")
        .exists()
        .withMessage("gender is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the create account validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];
/**
 * @description - This validation used for set new password
 */
 const setNewPasswordValidation = [
    body("token", "token is required.")
        .exists()
        .withMessage("Valid token is required."),
    body("password", "password is required.")
        .exists()
        .withMessage("password is required with + prefix"),
    body("confirmPassword", "confirmPassword is required.")
        .exists()
        .withMessage("Valid confirmPassword is required."),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the set new password validation ", {
                    error: errors.array(),
                });
                throw new ValidationFailure(`Validation Error`, errors.array());
            }
            next();
        } catch (error) {
            logger.error(error);
            next(error);
        }
    },
];


module.exports = {
    signupValidation,
    verifyLoginOtpValidation,
    socialLoginValidation,
    forgetPasswordValidation,
    resendOtpValidation,
    verifyForgetPasswordOtpValidation,
    setNewPasswordValidation,
    verifyMobileValidation,
    LoginValidation,
    createaccountValidation
   
};