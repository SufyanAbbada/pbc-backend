import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateDiscountActive: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discount } = req.body;

    if (!discount) {
      next();
      return;
    } else if (discount.isActive === false) {
      res.status(400).json({
        error: [
          {
            path: "discountCode",
            msg: "The discount code you provided is not active for these products",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateDiscountActive;
