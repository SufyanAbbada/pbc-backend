import { RequestHandler } from "express";
import { body } from "express-validator";

const validateIntegerField = (
  fieldName: string,
  minValue: number = 1,
  optional: boolean = false,
): RequestHandler[] => [
  optional
    ? body(fieldName)
        .optional()
        .isInt()
        .withMessage(`'${fieldName}' must be an integer`)
        .isInt({ min: minValue })
        .withMessage(
          `The provided '${fieldName}' must be greater than or equal to ${minValue}`,
        )
    : body(fieldName)
        .notEmpty()
        .withMessage(`'${fieldName}' is required`)
        .isInt()
        .withMessage(`'${fieldName}' must be an integer`)
        .isInt({ min: minValue })
        .withMessage(
          `The provided '${fieldName}' must be greater than or equal to ${minValue}`,
        ),
];

export default validateIntegerField;
