import { RequestHandler } from "express";
import { body, ValidationChain } from "express-validator";

const validateDateTimeField = (
  fieldName: string,
  mode: "mandatory" | "optional" = "mandatory",
): RequestHandler[] => {
  const baseValidation = body(fieldName)
    .trim()
    .isString()
    .withMessage(`'${fieldName}' must be a string`);

  const validationChain =
    mode === "optional"
      ? baseValidation.optional()
      : baseValidation.notEmpty().withMessage(`'${fieldName}' is required`);

  return [
    validationChain
      .matches(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?$/,
      )
      .withMessage(
        `The provided '${fieldName}' must be in the format YYYY-MM-DDTHH:mm or YYYY-MM-DDTHH:mm:ss.sssZ or with a timezone offset`,
      ),
  ];
};

export default validateDateTimeField;
