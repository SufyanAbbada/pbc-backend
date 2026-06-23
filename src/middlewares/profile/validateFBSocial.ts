import { body } from "express-validator";
import { RequestHandler } from "express";

const validateFBSocial: RequestHandler[] = [
  body("facebookSocial")
    .optional()
    .trim()
    .isString()
    .withMessage("'facebookSocial' must be a String")
    .isLength({ min: 20 })
    .withMessage("'facebookSocial' length must be 5 characters long")
    .matches(/facebook\.com/)
    .withMessage("Please provide a valid Public Facebook profile link."),
];

export default validateFBSocial;
