import { RequestHandler } from "express";
import { body } from "express-validator";

const validatePrice: RequestHandler[] = [
  body("price")
    .trim()
    .notEmpty()
    .withMessage("Product 'price' is required")
    .isNumeric()
    .withMessage("Product 'price' must be a number")
    .matches(/^\d+(\.\d{1,2})?$/)
    .withMessage(
      "Price must be a positive number with up to two decimal places.",
    ),
];

export default validatePrice;
