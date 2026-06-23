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
    const discount = await DiscountRepository.findDiscountByCode(discountCode);

    if (discount) {
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

export default validateDiscountCodeExistence;
