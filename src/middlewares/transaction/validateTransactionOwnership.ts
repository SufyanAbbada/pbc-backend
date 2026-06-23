// If transaction owner is the same as the user, then he cannot approve the transaction transactionId in params and user in body
import TransactionRepository from "../../repositories/TransactionRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateNoTransactionOwnweship: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { transactionId } = req.params;
    const { user } = req.body;

    const transaction = await TransactionRepository.getTransactionById(
      Number(transactionId),
    );

    if (transaction?.userId === user.id) {
      res.status(400).json({
        error: [
          {
            path: "transactionId",
            msg: "You can’t approve your own transaction. Please request relevant approvals",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateNoTransactionOwnweship;
