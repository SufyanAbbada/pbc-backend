import { body } from "express-validator";
import { RequestHandler } from "express";

const validateTwitterProfile = (field: string): RequestHandler[] => [
  body(field)
    .optional()
    .trim()
    .isString()
    .withMessage(`'${field}' must be a String`)
    .isLength({ min: 20, max: 100 })
    .withMessage(
      `The provided '${field}' length must be at least 20 characters and not exceed 100 characters`,
    )
    .matches(/(x\.com|twitter\.com)/)
    .withMessage(`Please provide a valid Twitter profile link`),
];

export default validateTwitterProfile;
