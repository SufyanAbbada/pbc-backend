import { RequestHandler } from "express";
import { body } from "express-validator";

const validateCandidates: RequestHandler[] = [
  body("candidateIds")
    .optional()
    .isArray({ min: 1 })
    .withMessage("candidateIds must be a non-empty array")
    .custom((value: number[]) => {
      const unique = new Set(value);
      if (unique.size !== value.length) {
        throw new Error(
          "The provided candidateIds must not contain duplicates",
        );
      }
      return true;
    }),

  body("candidateIds.*")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("Each candidate ID must be a positive integer"),
];

export default validateCandidates;
