import quoteRepository from "../../repositories/quoteRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { SourceType } from "../../common/enums";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateExistingQuote = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const quoteId =
        source === SourceType.BODY
          ? (req.body.quoteId as string)
          : (req.params.quoteId as string);

      const quote = await quoteRepository.getQuoteById(Number(quoteId));

      if (!quote) {
        res.status(404).json({
          error: [
            {
              path: "quoteId",
              msg: "We couldn't find a quote with the provided quote ID for any RFQ in the system",
            },
          ],
        });
        return;
      }

      req.body.quote = quote;
      req.body.rfq = quote.rfq;
      next();
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  };
};

export default validateExistingQuote;
