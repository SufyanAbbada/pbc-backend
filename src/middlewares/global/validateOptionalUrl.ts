import { RequestHandler } from "express";
import { param } from "express-validator";

const validateUrl = (fieldName: string): RequestHandler[] => [
  param(fieldName)
    .trim()
    .optional()
    .isString()
    .withMessage(`'${fieldName}' must be a string`)
    .isURL()
    .withMessage(`'${fieldName}' must be a valid URL`)
    .isLength({ min: 2, max: 150 })
    .withMessage(
      `The provided '${fieldName}' must be at least 2 characters long and no more than 150 characters`,
    )
    .matches(/^https?:\/\//)
    .withMessage(
      `The provided ${fieldName}' must begin with either 'https://' or 'http://'`,
    ),
];

export default validateUrl;
