import { body } from "express-validator";
import { RequestHandler } from "express";

const validateCalendlyLink: RequestHandler[] = [
  body("calendlyLink")
    .optional()
    .trim()
    .isString()
    .withMessage("'calendlyLink' must be a String")
    .isLength({ min: 20, max: 120 })
    .withMessage(
      "'calendlyLink' length must be 20 characters long and should not exceed 120 characters",
    )
    .matches(/calendly\.com/)
    .withMessage(
      "Invalid Calendly scheduling link. Please provide a correct one.",
    ),
];

export default validateCalendlyLink;
