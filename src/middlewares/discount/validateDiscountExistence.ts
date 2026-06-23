import DiscountRepository from "../../repositories/DiscountRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateDiscountExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (
    !(await DiscountRepository.findDiscountById(Number(req.params.discountId)))
  ) {
    res.status(202).json({
      message:
        "We couldn't find this discount in the system. Please recheck discount ID",
    });
  }

  next();
};

export default validateDiscountExistence;
