import { RequestHandler } from "express";
import { body } from "express-validator";

const validatePollOptions: RequestHandler[] = [
  body("pollOptions")
    .optional()
    .isArray({ min: 2 })
    .withMessage(
      "pollOptions must be a non-empty array, containing at least 2 values.",
    )
    .custom((value: number[]) => {
      const unique = new Set(value);
      if (unique.size !== value.length) {
        throw new Error("The provided pollOptions must not contain duplicates");
      }
      return true;
    }),
  body("pollOptions.*")
    .optional()
    .isString()
    .withMessage("Each poll option must be a string"),
];

export default validatePollOptions;
