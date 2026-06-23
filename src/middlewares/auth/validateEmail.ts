import { RequestHandler } from "express";
import { body } from "express-validator";

const validateEmail = (fieldName: string = "email"): RequestHandler[] => [
  body(fieldName)
    .trim()
    .toLowerCase()
    .notEmpty()
    .withMessage(`${fieldName}' is required`)
    .isEmail()
    .withMessage(
      `The provided email: ${fieldName}' must be a valid email address`,
    )
    .isLength({ min: 6, max: 320 })
    .withMessage(
      `The length of email: '${fieldName}' must be between 6 and 320 characters, as specified by RFC 5321`,
    ),
];

export default validateEmail;
