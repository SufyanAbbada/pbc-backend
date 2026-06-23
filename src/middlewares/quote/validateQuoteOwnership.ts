import QuoteRepository from "../../repositories/quoteRepository";
import { Request, Response, NextFunction } from "express";

const validateQuoteOwnership = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { quoteId } = req.params;
    const { user } = req.body;

    const isOwner = await QuoteRepository.getQuoteByIdAndUserId(
      Number(quoteId),
      user.id,
    );

    if (!isOwner) {
      res.status(403).json({
        error: [
          {
            path: "quoteId",
            msg: "You are not the owner of this quote & are not authorized to perform this action.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateQuoteOwnership;
