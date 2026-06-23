import { body } from "express-validator";
import { RequestHandler } from "express";

const validateOTP = (fieldName: string): RequestHandler[] => [
  body(fieldName)
    .notEmpty()
    .withMessage(`${fieldName} is required`)
    .isString()
    .withMessage(`${fieldName} must be a String`)
    .isLength({ min: 6, max: 6 })
    .withMessage(`The provided ${fieldName} length must be 6 characters long`)
    .matches(/^\d+$/)
    .withMessage(`The provided ${fieldName} must contain only numeric digits.`),
];

export default validateOTP;
