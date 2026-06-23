import { RequestHandler } from "express";
import { body } from "express-validator";

const FIELD_FREQUENCIES = {
  name: { min: 2, max: 150 },
  title: { min: 5, max: 200 },
  notes: { min: 5, max: 1000 },
  description: { min: 5, max: 1000 },
  bio: { min: 5, max: 1000 },
  country: { min: 2, max: 56 },
  termsAndConditions: { min: 5, max: 2000 },
  terms: { min: 5, max: 2000 },
  discountCode: { min: 6, max: 12 },
  addressLine2: { min: 2, max: 100 },
  annualRevenue: { min: 1, max: 50 },
  suggestions: { min: 5, max: 500 },
  comment: { min: 5, max: 500 },
  details: { min: 5, max: 1000 },
  categoryName: { min: 1, max: 200 },
  linkedInProfile: { min: 5, max: 1000 },
  twitterProfile: { min: 5, max: 1000 },
  location: { min: 5, max: 500 },
  venue: { min: 5, max: 500 },
};

const validateOptional = (
  fieldName: keyof typeof FIELD_FREQUENCIES,
): RequestHandler[] => {
  const { min, max } = FIELD_FREQUENCIES[fieldName] || {
    min: 5,
    max: 1000,
  };

  return [
    body(fieldName)
      .optional()
      .isString()
      .withMessage(`'${fieldName}' must be a string`)
      .isLength({ min, max })
      .withMessage(
        `The '${fieldName}' length must be at least ${min} characters long and should not exceed ${max} characters`,
      )
      .matches(/^(?!\d+$).+/)
      .withMessage(`'The provided ${fieldName}' cannot be only numbers.`),
  ];
};

export default validateOptional;
