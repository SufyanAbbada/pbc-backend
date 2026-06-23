import { body } from "express-validator";
import { RequestHandler } from "express";

const FIELD_VALIDATIONS = {
  yearOfEstablishment: { min: 1900, max: 2100 },
  age: { min: 16, max: 90 },
  experience: { min: 0, max: 50 },
};

const validateYearField = (
  fieldName: keyof typeof FIELD_VALIDATIONS,
): RequestHandler[] => {
  const { min, max } = FIELD_VALIDATIONS[fieldName];

  return [
    body(fieldName)
      .trim()
      .notEmpty()
      .withMessage(`'${fieldName}' is required.`)
      .isInt({ min, max })
      .withMessage(
        `The provided '${fieldName}' must be a valid number between ${min} and ${max}.`,
      ),
  ];
};

export default validateYearField;
