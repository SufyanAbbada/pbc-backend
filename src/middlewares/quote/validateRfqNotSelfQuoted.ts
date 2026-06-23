import generalErrorResponse from "../../utils/generalErrorResponse";
import RfqRepository from "../../repositories/RfqRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateRfqNotSelfQuoted: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      rfqId,
      user: { id: userId },
    } = req.body;

    const rfq = await RfqRepository.getRfqById(Number(rfqId));
    if (Number(userId) === rfq?.userId) {
      res.status(400).json({
        error: [
          {
            path: "rfqId",
            msg: "You can’t quote on your own RFQ. Please choose a different one",
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

export default validateRfqNotSelfQuoted;
