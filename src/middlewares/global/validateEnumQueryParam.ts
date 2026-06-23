import { RequestHandler } from "express";
import { query } from "express-validator";

const validateEnumQueryParam = <T extends object>(
  fieldName: string,
  enumObject: T,
): RequestHandler[] => {
  const enumValues = Object.values(enumObject);

  return [
    query(fieldName)
      .optional()
      .trim()
      .custom((value) => {
        if (value && !enumValues.includes(value)) {
          const validOptions = enumValues.join(", ");
          throw new Error(`'The ${fieldName}' must be one of: ${validOptions}`);
        }
        return true;
      }),
  ];
};

export default validateEnumQueryParam;
