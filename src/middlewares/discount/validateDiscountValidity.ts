import DiscountRepository from "../../repositories/DiscountRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateDiscountCodeValidity: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountCode } = req.body;

    if (!discountCode) {
      next();
      return;
    }

    const discount = await DiscountRepository.findDiscountByCode(discountCode);

    if (discount && new Date(discount.validUntil).getTime() < Date.now()) {
      res.status(400).json({
        error: [
          {
            path: "discountCode",
            msg: "The discount code has expired. Please use a valid one",
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

export default validateDiscountCodeValidity;
