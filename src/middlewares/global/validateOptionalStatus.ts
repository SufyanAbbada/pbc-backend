import { RequestHandler } from "express";
import { body } from "express-validator";

const validateOptionalEnumField = (
  fieldName: string,
  validValues: Record<string, string>,
): RequestHandler[] => [
  body(fieldName)
    .optional()
    .trim()
    .isString()
    .withMessage(`'${fieldName}' must be a string`)
    .isIn(Object.values(validValues))
    .withMessage(
      `The provided '${fieldName}' must be one of: ${Object.values(validValues).join(", ")}`,
    ),
];

export default validateOptionalEnumField;
