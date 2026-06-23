import { RequestHandler } from "express";
import { body } from "express-validator";
import { PHONE_NUMBERS } from "../../common/constants";

const validatePhone: RequestHandler[] = [
  body("phoneNumber")
    .trim()
    .notEmpty()
    .withMessage("'phoneNumber' is required")
    .isString()
    .withMessage("'phoneNumber' must be a string")
    .isLength({ min: 7, max: 17 })
    .withMessage(
      "The provided 'phoneNumber' must be between 7 to 17 characters",
    )
    .matches(/^\+\d+$/)
    .withMessage(
      "The provided 'phoneNumber' must start with '+' followed by only digits",
    )
    .custom((value) => {
      const isValidCode = PHONE_NUMBERS.COUNTRY_CODES.some((code) =>
        value.startsWith(code),
      );
      if (!isValidCode) {
        throw new Error(
          "The provided phone number must start with a valid country code.",
        );
      }
      return true;
    }),
];

export default validatePhone;
