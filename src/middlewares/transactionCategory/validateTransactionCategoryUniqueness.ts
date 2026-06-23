import TransactionCategoryRepository from "../../repositories/TransactionCategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateTransactionCategoryUniqueness: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  const existingTransactionCategory =
    await TransactionCategoryRepository.getTransactionCategoryByName(name);

  if (existingTransactionCategory) {
    res.status(400).json({
      error: [
        {
          path: "name",
          msg: "This transaction category name already exists. Please choose a different and unique name",
        },
      ],
    });
    return;
  }

  next();
};

export default validateTransactionCategoryUniqueness;
