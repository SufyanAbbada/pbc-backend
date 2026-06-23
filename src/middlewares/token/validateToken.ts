import { RequestHandler } from "express";
import { header } from "express-validator";
import { verifyToken } from "../../utils/jwtHandler";

const validateToken: RequestHandler[] = [
  header("token")
    .trim()
    .notEmpty()
    .withMessage("'token' is required")
    .isString()
    .withMessage("'token' must be a String")
    .custom((value) => {
      if (!verifyToken(value))
        throw new Error("The token you provided is either invalid or expired");
      return true;
    }),
];

export default validateToken;
