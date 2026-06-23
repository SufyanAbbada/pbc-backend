import { body } from "express-validator";
import { RequestHandler } from "express";

const validateLinkedInSocial = (field: string): RequestHandler[] => [
  body(field)
    .optional()
    .trim()
    .isString()
    .withMessage(`'${field}' must be a String`)
    .isLength({ min: 25, max: 100 })
    .withMessage(
      `The provided '${field}' length must be 25 characters long and should not exceed 100 characters`,
    )
    .matches(/linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+/)
    .withMessage(
      `Please provide a correct LinkedIn Personal/Company Profile Link`,
    ),
];

export default validateLinkedInSocial;
