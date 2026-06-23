import { RequestHandler } from "express";
import { body, param } from "express-validator";
import { SourceType } from "../../common/enums";

const validateIds = (
  fieldName: string,
  source: SourceType = SourceType.BODY,
  optional: boolean = true,
): RequestHandler[] => {
  const validator =
    source === SourceType.BODY ? body(fieldName) : param(fieldName);

  const validatorArr =
    source === SourceType.BODY
      ? body(`${fieldName}.*`)
      : param(`${fieldName}.*`);

  const arrayValidator = validator
    .isArray({ min: 1 })
    .withMessage(`${fieldName} must be a non-empty array`)
    .custom((value: number[]) => {
      const unique = new Set(value);
      if (unique.size !== value.length) {
        throw new Error(
          `The provided ${fieldName} must not contain duplicates`,
        );
      }
      return true;
    });

  const elementValidator = validatorArr
    .isInt({ gt: 0 })
    .withMessage(`Each ${fieldName} must be a positive integer`);

  return [
    optional ? arrayValidator.optional() : arrayValidator,
    optional ? elementValidator.optional() : elementValidator,
  ];
};

export default validateIds;
