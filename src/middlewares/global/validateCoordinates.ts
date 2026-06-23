import { RequestHandler } from "express";
import { body } from "express-validator";

const validateCoordinate = (
  field: "latitude" | "longitude",
  isOptional: boolean = false,
): RequestHandler[] => {
  const validator = body(field);

  return [
    isOptional
      ? validator.optional()
      : validator.notEmpty().withMessage(`'${field}' is required.`),
    validator
      .isFloat(
        field === "latitude" ? { min: -90, max: 90 } : { min: -180, max: 180 },
      )
      .withMessage(
        `'${field}' must be a valid ${field === "latitude" ? "latitude (-90 to 90)" : "longitude (-180 to 180)"}`,
      )
      .matches(/^-?\d+\.\d{4,7}$/)
      .withMessage(
        `The provided '${field}' must have between 4 and 7 decimal places`,
      ),
  ];
};

export default validateCoordinate;
