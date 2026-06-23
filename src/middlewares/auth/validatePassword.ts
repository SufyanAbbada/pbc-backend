import { RequestHandler } from "express";
import { body } from "express-validator";

const validatePassword: RequestHandler[] = [
  body("password")
    .notEmpty()
    .withMessage("'password' is required")
    .isString()
    .withMessage("'password' must be a string")
    .isLength({ min: 6, max: 50 })
    .withMessage(
      "'password' length must be at least 6 characters long and should not exceed 50 characters",
    )
    .matches(/[A-Z]/)
    .withMessage("'password' must contain at least one uppercase letter (A-Z)")
    .matches(/[a-z]/)
    .withMessage("'password' must contain at least one lowercase letter (a-z)")
    .matches(/[0-9]/)
    .withMessage("'password' must contain at least one number (0-9)")
    .matches(/[!@#$%^&*()]/)
    .withMessage(
      "'password' must contain at least one special character (!@#$%^&*())",
    ),
];

export default validatePassword;
