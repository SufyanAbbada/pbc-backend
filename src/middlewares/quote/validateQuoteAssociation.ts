import quoteRepository from "../../repositories/quoteRepository";
import { Request, Response, NextFunction } from "express";

const validateQuoteAssociation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { quoteId } = req.body;
  const { rfqId } = req.params;

  const quote = await quoteRepository.getQuoteById(Number(quoteId));

  if (quote?.rfqId !== Number(rfqId)) {
    res.status(400).json({
      error: [
        {
          path: "quoteId",
          msg: "We couldn't find a quote for this RFQ. Please recheck the quote ID",
        },
      ],
    });
    return;
  }

  next();
};

export default validateQuoteAssociation;
