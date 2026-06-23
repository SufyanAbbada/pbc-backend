import { RequestHandler } from "express";
import { body } from "express-validator";

const validateUrl: RequestHandler[] = [
  body("website")
    .trim()
    .notEmpty()
    .withMessage("'website' is required")
    .isString()
    .withMessage("'website' must be a string")
    .isURL({ require_protocol: false })
    .withMessage("The provided 'website' must be a valid URL")
    .isLength({ min: 2, max: 150 })
    .withMessage(
      "The provided 'website' length must be at least 2 characters long and should not exceed 150 characters",
    ),
];

export default validateUrl;
