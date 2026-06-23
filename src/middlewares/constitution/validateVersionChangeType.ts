import { body } from "express-validator";
import { RequestHandler } from "express";
import { PolicyVersion } from "../../common/enums";

const validateVersionChangeType: RequestHandler[] = [
  body("version")
    .trim()
    .isString()
    .withMessage("'Semantic Versioning' must be a string")
    .notEmpty()
    .withMessage("'Semantic Versioning' is required")
    .isLength({ min: 5, max: 5 })
    .withMessage("The provided 'Semantic Versioning' must be 5 characters long")
    .isIn(Object.values(PolicyVersion))
    .withMessage(
      "The provided 'Semantic Versioning' must be one of: major, minor, patch",
    ),
];

export default validateVersionChangeType;
