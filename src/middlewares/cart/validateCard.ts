import luhn from "luhn";
import { body } from "express-validator";
import { RequestHandler } from "express";

const validateCard: RequestHandler[] = [
  body("cardNumber")
    .trim()
    .notEmpty()
    .withMessage("'cardNumber' is required.")
    .isString()
    .withMessage("'cardNumber' must be a string.")
    .matches(/^\d{13,19}$/)
    .withMessage(
      "The provided 'cardNumber' must be between 13 and 19 digits and contain only numbers.",
    )
    .custom((value) => {
      if (!luhn.validate(value)) {
        throw new Error("The provided 'cardNumber' is invalid.");
      }
      return true;
    }),
];

export default validateCard;
