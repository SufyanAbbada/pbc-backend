import QuoteRepository from "../../repositories/quoteRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateRfqDependency = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const rfqId =
      source === SourceType.BODY ? req.body.rfqId : req.params.rfqId;

    const { quotes } = await QuoteRepository.getQuoteByRfqId(Number(rfqId));

    if (quotes.length > 0) {
      res.status(403).json({
        error: [
          {
            path: "rfqId",
            msg: "You cannot delete this RFQ as it is associated with some quotes.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateRfqDependency;
