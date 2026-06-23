import TransactionRepository from "../../repositories/TransactionRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateDependingTransactions: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { categoryId } = req.params;

  const dependentTransactions =
    await TransactionRepository.getTransactionsByCategoryId(Number(categoryId));

  if (dependentTransactions?.length > 0) {
    res.status(403).json({
      error: [
        {
          path: "transactionsCategoryId",
          msg: "You cannot delete this transaction category because it is associated with existing transactions.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateDependingTransactions;
