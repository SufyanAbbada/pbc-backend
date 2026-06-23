import { RequestHandler } from "express";
import { body } from "express-validator";

const validateOptionalDate = (fieldName: string): RequestHandler[] => [
  body(fieldName)
    .optional()
    .trim()
    .notEmpty()
    .withMessage(`'${fieldName}' is required`)
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage(
      `The provided '${fieldName}' must be in the format YYYY-MM-DD`,
    ),
];

export default validateOptionalDate;
