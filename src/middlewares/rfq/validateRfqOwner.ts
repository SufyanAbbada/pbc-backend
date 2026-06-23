import generalErrorResponse from "../../utils/generalErrorResponse";
import RfqRepository from "../../repositories/RfqRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateRfqOwner: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rfqId } = req.params;
    const {
      user: { id: userId },
    } = req.body;

    const rfq = await RfqRepository.getRfqById(Number(rfqId));
    if (Number(userId) !== rfq?.userId) {
      res.status(400).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this Rfq. User can only update/delete their own RFQ.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateRfqOwner;
