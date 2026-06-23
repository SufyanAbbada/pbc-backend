import generalErrorResponse from "../../utils/generalErrorResponse";
import QuoteRepository from "../../repositories/quoteRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateSingleQuotePerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      rfqId,
      user: { id: userId },
    } = req.body;

    const { quotes, totalCount } = await QuoteRepository.getQuoteByRfqId(
      Number(rfqId),
    );

    if (quotes.filter((quote) => quote.userId === Number(userId)).length > 0) {
      res.status(400).json({
        error: [
          {
            path: "rfqId",
            msg: "You cannot submit more than one quote for the same RFQ",
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

export default validateSingleQuotePerUser;
