import { body } from "express-validator";
import { RequestHandler } from "express";

const validateEmiratesId: RequestHandler[] = [
  body("emiratesId")
    .trim()
    .notEmpty()
    .withMessage("'emiratesId' is required.")
    .isString()
    .withMessage("'emiratesId' must be a string.")
    .isLength({ min: 15, max: 15 })
    .withMessage("The provided 'emiratesId' must be exactly 15 digits long.")
    .matches(/^784\d{12}$/)
    .withMessage(
      "The provided 'emiratesId' must start with '784' and contain only numbers.",
    ),
];

export default validateEmiratesId;
