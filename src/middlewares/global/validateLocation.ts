import { body } from "express-validator";

const validateLocation = [
  body("location")
    .trim()
    .notEmpty()
    .withMessage("'location' is required")
    .isString()
    .withMessage("'location' must be a String")
    .matches(/^[-+]?\d{1,2}\.\d+,\s*[-+]?\d{1,3}\.\d+$/)
    .withMessage(
      "The provided 'location' must be in the format 'latitude,longitude'",
    ),
];

export default validateLocation;
