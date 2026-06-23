import { RequestHandler } from "express";
import { body } from "express-validator";

const validateEnumField = (
  fieldName: string,
  validValues: Record<string, string>,
): RequestHandler[] => [
  body(fieldName)
    .trim()
    .isString()
    .withMessage(`'${fieldName}' must be a string`)
    .notEmpty()
    .withMessage(`'${fieldName}' is required`)
    .isIn(Object.values(validValues))
    .withMessage(
      `The provided '${fieldName}' must be one of: ${Object.values(validValues).join(", ")}`,
    ),
];

export default validateEnumField;
