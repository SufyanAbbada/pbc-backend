import TransactionCategoryRepository from "../../repositories/TransactionCategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateTransactionCategoryExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const categoryId = req.params?.categoryId || req.body?.categoryId;

  if (categoryId) {
    const transactionCategory =
      await TransactionCategoryRepository.getTransactionCategoryById(
        Number(categoryId),
      );

    if (!transactionCategory) {
      res.status(404).json({
        error: [
          {
            path: "categoryId",
            msg: "We couldn't find the transaction category. Please recheck the category ID",
          },
        ],
      });
      return;
    }

    next();
  } else next();
};

export default validateTransactionCategoryExistence;
