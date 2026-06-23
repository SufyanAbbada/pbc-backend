import { RequestHandler } from "express";
import { body } from "express-validator";

const validateNumericField = (fieldName: string): RequestHandler[] => [
  body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`'${fieldName}' is required`)
    .isNumeric()
    .withMessage(`'${fieldName}' must be a number`)
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage(
      `The provided '${fieldName}' must be a positive number with up to two decimal places`,
    ),
];

export default validateNumericField;
