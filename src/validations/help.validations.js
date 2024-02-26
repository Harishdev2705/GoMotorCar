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
 * @description - This validation used for update Plan validation
 * 
 */
const helpUpdateValidation = [
    body("id", "id is required.")
        .exists()
        .notEmpty()
    .withMessage("id is required"),
    body("question", "question is required.")
        .exists()
        .notEmpty()
        .withMessage("question is required"),
    body("answer", "answer is required.")
        .exists()
        .notEmpty()
        .withMessage("answer is required"),
    async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                logger.error("error in the Plan validation ", {
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
    helpUpdateValidation

};