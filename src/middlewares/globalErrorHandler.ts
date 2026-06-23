import { Request, Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";

const validate: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const statusCode = errors
      .array()
      .some(
        (error) =>
          error.type === "field" &&
          error.path === "token" &&
          error.location === "headers",
      )
      ? 401
      : 400;
    res.status(statusCode).json({ error: errors.array() });
    return;
  }
  next();
};

export default validate;
