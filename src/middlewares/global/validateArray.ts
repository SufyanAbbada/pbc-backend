import { RequestHandler } from "express";
import { body, CustomValidator } from "express-validator";

const isUniqueArray: CustomValidator = (value) => {
  if (!Array.isArray(value)) return false;
  const unique = new Set(value);
  return unique.size === value.length;
};

const validateArrayField = (
  fieldName: string,
  type: "int" | "string" = "string",
  required: boolean = true,
  min: number = 1,
  max?: number,
): RequestHandler[] => {
  const typeValidation =
    type === "int"
      ? body(`${fieldName}.*`)
          .isInt({ gt: 0 })
          .withMessage(`Each item in '${fieldName}' must be a positive integer`)
      : body(`${fieldName}.*`)
          .isString()
          .withMessage(`Each item in '${fieldName}' must be a string`);

  const arrayLengthMessage = () => {
    if (max)
      return `'${fieldName}' must contain at least ${min} and at most ${max} item(s)`;
    return `'${fieldName}' must contain at least ${min} item(s)`;
  };

  const arrayValidation = body(fieldName)
    .if(() => required)
    .exists()
    .withMessage(`'${fieldName}' is required`)
    .isArray({ min, max })
    .withMessage(arrayLengthMessage())
    .custom(isUniqueArray)
    .withMessage(`The provided '${fieldName}' must contain unique items`);

  return [arrayValidation, typeValidation];
};

export default validateArrayField;
