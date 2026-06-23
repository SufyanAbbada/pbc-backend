import TransactionRepository from "../../repositories/TransactionRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateTransactionExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const transactionId = req.params?.transactionId || req.body?.transactionId;

  const transaction = await TransactionRepository.getTransactionById(
    Number(transactionId),
  );

  if (!transaction) {
    res.status(404).json({
      error: [
        {
          path: "transactionId",
          msg: "We couldn’t find this transaction. Please recheck the transaction ID",
        },
      ],
    });
    return;
  }

  next();
};

export default validateTransactionExistence;
