import { RequestHandler } from "express";
import { body } from "express-validator";

const validateDateField = (fieldName: string): RequestHandler[] => [
  body(fieldName)
    .trim()
    .isString()
    .withMessage(`'${fieldName}' must be a string`)
    .notEmpty()
    .withMessage(`'${fieldName}' is required`)
    .isISO8601()
    .withMessage(
      `'The provided ${fieldName}' must be a valid ISO date format (e.g., YYYY-MM-DDTHH:mm:ssZ)`,
    ),
];

export default validateDateField;
