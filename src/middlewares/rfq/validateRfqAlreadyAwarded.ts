import generalErrorResponse from "../../utils/generalErrorResponse";
import RfqRepository from "../../repositories/RfqRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateRfqAlreadyAwarded: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rfqId } = req.params;

    const rfq = await RfqRepository.getRfqById(Number(rfqId));
    if (rfq?.awardedQuoteId) {
      res.status(400).json({
        error: [
          {
            path: "rfqId",
            msg: "This RFQ has already been awarded. You cannot assign a quote to an awarded RFQ.",
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

export default validateRfqAlreadyAwarded;
