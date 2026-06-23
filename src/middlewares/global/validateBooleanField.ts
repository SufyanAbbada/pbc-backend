import { RequestHandler } from "express";
import { body } from "express-validator";

const validateBooleanField = (fieldName: string): RequestHandler[] => [
  body(fieldName)
    .trim()
    .notEmpty()
    .withMessage(`'${fieldName}' is required`)
    .isBoolean()
    .withMessage(`'${fieldName}' must be a boolean`)
    .toBoolean(),
];

export default validateBooleanField;
