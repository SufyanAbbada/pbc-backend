import { Request, Response, NextFunction } from "express";

const jsonErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err instanceof SyntaxError && "body" in err) {
    return res.status(400).json({
      error: [
        {
          path: "request",
          msg: "The request data seems to be incorrect. Please check the information and try again",
        },
      ],
    });
  }
  next(err);
};

export default jsonErrorHandler;
