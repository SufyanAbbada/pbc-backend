import { RequestHandler } from "express";
import { body } from "express-validator";

const validateHsCodesFormat: RequestHandler[] = [
  body("hsCodes.*")
    .matches(/^\d{4}\.\d{4}$/)
    .withMessage("Each 'hsCode' must follow the '1234.1234' format"),
];

export default validateHsCodesFormat;
