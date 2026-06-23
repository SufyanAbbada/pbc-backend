import DiscountRepository from "../../repositories/DiscountRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateDiscountCodeAvailability: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountCode } = req.body;
    const { discountId } = req.params;
    const discount = await DiscountRepository.findDiscountByCode(discountCode);

    if (discount && discount.id !== Number(discountId)) {
      res.status(400).json({
        error: [
          {
            path: "discountCode",
            msg: "The given discount code already exists in the system",
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

export default validateDiscountCodeAvailability;
