import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateDiscountApplied: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discount, cart } = req.body;

    if (!discount) {
      next();
      return;
    } else if (
      cart.items.some(
        (item: { sellerId: number }) =>
          item.sellerId !== Number(discount.userId),
      )
    ) {
      res.status(400).json({
        error: [
          {
            path: "discountCode",
            msg: "The discount code you've entered doesn't apply to these products",
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

export default validateDiscountApplied;
