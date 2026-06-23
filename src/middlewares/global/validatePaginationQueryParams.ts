import { RequestHandler } from "express";
import { query } from "express-validator";

const validatePaginationQueryParams = (fieldName: string): RequestHandler[] => [
  query(fieldName)
    .optional()
    .trim()
    .matches(/^\d+$/)
    .withMessage(`The provided '${fieldName}' must contain only digits`)
    .toInt()
    .isInt({ min: 1 })
    .withMessage(`'${fieldName}' must be a positive integer`),
];

export default validatePaginationQueryParams;
