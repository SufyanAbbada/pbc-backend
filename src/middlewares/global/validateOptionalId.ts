import { param, body } from "express-validator";
import { RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateOptionalId = (
  fieldName: string,
  source: SourceType = SourceType.PARAM,
): RequestHandler[] => {
  const validator =
    source === SourceType.BODY ? body(fieldName) : param(fieldName);

  return [
    validator
      .optional()
      .isNumeric()
      .withMessage(`'${fieldName}' must be a number`)
      .matches(/^\d+$/)
      .withMessage(`'The provided ${fieldName}' should only contain digits`)
      .isInt({ min: 1 })
      .withMessage(
        `The provided '${fieldName}' must be a positive integer, with a minimum value of 1`,
      ),
  ];
};

export default validateOptionalId;
