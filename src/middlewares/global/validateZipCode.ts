import { RequestHandler } from "express";
import { body } from "express-validator";

const validateZipCode: RequestHandler[] = [
  body("zipCode")
    .trim()
    .notEmpty()
    .withMessage("Zip code is required")
    .isString()
    .withMessage("Zip code must be a string")
    .isLength({ min: 3, max: 10 })
    .withMessage("The provided zip code must be between 3 and 10 characters")
    .matches(/^[A-Za-z0-9\s-]+$/)
    .withMessage("The provided zip code format is invalid"),
];

export default validateZipCode;
