import generalErrorResponse from "../../utils/generalErrorResponse";
import DiscountRepository from "../../repositories/DiscountRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateDiscountOwner: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { discountId } = req.params;
    const {
      user: { id: userId },
    } = req.body;

    const discount = await DiscountRepository.findDiscountById(
      Number(discountId),
    );

    if (Number(userId) !== discount?.userId) {
      res.status(400).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this discount. User can only update/delete their own discount",
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

export default validateDiscountOwner;
