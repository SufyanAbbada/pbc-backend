import { RequestHandler } from "express";
import { query } from "express-validator";

const validateQueryField = (
  fieldName: string,
  minLength: number = 1,
  maxLength: number = 100,
): RequestHandler[] => [
  query(fieldName)
    .optional()
    .trim()
    .isLength({ min: minLength, max: maxLength })
    .withMessage(
      `The provided '${fieldName}' must be between ${minLength} and ${maxLength} characters`,
    )
    .matches(/^[A-Za-z0-9\s.,'-]+$/)
    .withMessage(`The provided '${fieldName}' contains invalid characters`),
];

export default validateQueryField;
