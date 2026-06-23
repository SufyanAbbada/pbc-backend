import { NextFunction, RequestHandler, Request, Response } from "express";

const validateDiscountValue: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { value } = req.body;

  if (value && ((value && value < 0) || value > 100)) {
    res.status(400).json({
      error: [
        {
          path: "value",
          msg: "The discount value must be between 0 and 100. Please enter a valid value",
        },
      ],
    });
    return;
  }

  next();
};

export default validateDiscountValue;
