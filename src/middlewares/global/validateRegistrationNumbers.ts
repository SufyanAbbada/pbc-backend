import { RequestHandler } from "express";
import { body } from "express-validator";

const FIELD_VALIDATIONS = {
  passportNumber: { min: 6, max: 9, regex: /^[A-Z0-9]+$/i },
  vatRegistrationNumber: { min: 5, max: 20, regex: /^[A-Z0-9-]+$/i },
  tradeLicenseNumber: { min: 5, max: 20, regex: /^[A-Z0-9-]+$/i },
  transactionId: { min: 5, max: 50, regex: /^[A-Z0-9-]+$/i },
};

const validateRegistrationNumbers = (
  fieldName: keyof typeof FIELD_VALIDATIONS,
): RequestHandler[] => {
  const { min, max, regex } = FIELD_VALIDATIONS[fieldName];

  return [
    body(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`'${fieldName}' is required`)
      .isString()
      .withMessage(`'${fieldName}' must be a string`)
      .isLength({ min, max })
      .withMessage(
        `The provided '${fieldName}' must be between ${min} and ${max} characters`,
      )
      .matches(regex)
      .withMessage(`The provided '${fieldName}' contains invalid characters`),
  ];
};

export default validateRegistrationNumbers;
