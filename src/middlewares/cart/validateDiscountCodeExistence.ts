import DiscountRepository from "../../repositories/DiscountRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateDiscountCodeExistence: RequestHandler = async (
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

    if (!discount) {
      res.status(400).json({
        error: [
          {
            path: "discountCode",
            msg: "We couldn’t find the discount code in the system",
          },
        ],
      });
      return;
    }

    req.body.discount = discount;

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateDiscountCodeExistence;
