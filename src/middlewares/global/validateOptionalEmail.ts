import { RequestHandler } from "express";
import { body } from "express-validator";

const validateOptionalEmail = (
  fieldName: string = "email",
): RequestHandler[] => [
  body(fieldName)
    .trim()
    .toLowerCase()
    .optional()
    .isEmail()
    .withMessage(
      `The provided email: ${fieldName}' must be a valid email address`,
    )
    .isLength({ min: 6, max: 320 })
    .withMessage(
      `The provided '${fieldName}' must be between 6 and 320 characters, as defined by RFC 5321`,
    ),
];

export default validateOptionalEmail;
