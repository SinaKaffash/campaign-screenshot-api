// const { body, validationResult } = require("express-validator");
import { body, validationResult } from "express-validator";

const validateCampaign = [
    body("camp_num")
        .notEmpty()
        .withMessage("Campaign number is required")
        .isNumeric()
        .withMessage("Campaign number must be a number"),

    body("camp_text")
        .notEmpty()
        .withMessage("Campaign text is required")
        .isLength({ min: 1, max: 1000 })
        .withMessage("Campaign text must be between 1 and 1000 characters"),

    body("selected_channels")
        .isArray({ min: 1 })
        .withMessage("Selected channels must be a non-empty array"),

    body("selected_channels.*")
        .notEmpty()
        .withMessage("Channel name cannot be empty")
        .isLength({ min: 1, max: 100 })
        .withMessage("Channel name must be between 1 and 100 characters"),
];

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

// module.exports = {
//   validateCampaign,
//   handleValidationErrors
// };
export { validateCampaign, handleValidationErrors }; // Use ES6 export if your environment supports it
