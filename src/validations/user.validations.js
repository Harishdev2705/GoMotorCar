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
 * @description - This validation used for update profile validation
 */
const updateProfileValidation = [
    body("name", "name is required.")
        .exists()
        .withMessage("Name is required."),
    body("email", "email is required.")
        .exists()
        .withMessage("Email is required"),
    body("city", "city is required.")
        .exists()
        .withMessage("city is required."),
    body("gender", "gender is required.")
        .exists()
        .withMessage("gender is required."),
    body("dob", "dob is required.")
        .exists()
        .withMessage("dob is required."),
    body("about", "about is required.")
        .exists()
        .withMessage("about is required."),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the update profile validation ", {
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
 * @description - This validation used for update unit and notification validation
 */
const updateUnitAndNotificationValidation = [
    body("unitLimit", "unitLimit is required.")
        .exists()
        .withMessage("unitLimit is required."),
    body("isPushNotificationOn", "isPushNotificationOn is required.")
        .exists()
        .withMessage("isPushNotificationOn is required"),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the update unit and notification validation ", {
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
 * @description - This validation used for add mony to wallet validation
 */
const addMonyToWalletValidation = [
    body("amount", "amount is required.")
        .exists()
        .withMessage("amount is required."),
    body("card", "card is required.")
        .exists()
        .withMessage("card is required"),

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the add mony to wallet validation ", {
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
 * @description - This validation used for get userfunctions list
 */
const getuserfunctionslistValidation = [
    body("type", "Function type is required.")
        .exists()
        .withMessage("Function type is required."),   

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the get userfunctions list validation ", {
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
 * @description - This validation used for update userfunctions list
 */
const updatefunctionslistValidation = [
    body("name", "Function name is required.")
        .exists()
        .withMessage("Function name is required."), 
    body("id", "Function id is required.")
    .exists()
    .withMessage("Function id is required."),   

    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the get userfunctions list validation ", {
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
 * @description - This validation used for craete userfunctions list
 */
const createuserfunctionslistValidation = [
    body("type", "Function type is required.")
        .exists()
        .withMessage("Function type is required."),   
    body("name", "Function name is required.")
        .exists()
        .withMessage("Function name is required"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the craete userfunctions validation ", {
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
 * @description - This validation used for craete services list
 */
const createserviceslistValidation = [      
    body("name", "Function name is required.")
        .exists()
        .withMessage("Function name is required"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the craete services validation ", {
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
 * @description - This validation used for craete sub services list
 */
const createsubserviceslistValidation = [      
    body("name", "Sub service name is required.")
        .exists()
        .withMessage("Sub service name is required"),
    body("service_id", "ID  is required.")
        .exists()
        .withMessage("ID  is required"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the craete services validation ", {
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
 * @description - This validation used for craete services list
 */
const updateservicesValidation = [      
    body("name", "service name is required.")
        .exists()
        .withMessage("service name is required"),
    body("id", "service id is required.")
    .exists()
    .withMessage("service id  is required"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the craete services validation ", {
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
    updateProfileValidation,
    updateUnitAndNotificationValidation,
    addMonyToWalletValidation,
    getuserfunctionslistValidation,
    createuserfunctionslistValidation,
    createserviceslistValidation,
    createsubserviceslistValidation,
    updateservicesValidation,
    updatefunctionslistValidation
};