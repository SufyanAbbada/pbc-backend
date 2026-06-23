import TransactionRepository from "../../repositories/TransactionRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { GeneralStatus } from "../../common/enums";

const validateTransactionPending: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { transactionId } = req.params;

    const transaction = await TransactionRepository.getTransactionById(
      Number(transactionId),
    );

    if (transaction?.status !== GeneralStatus.PENDING) {
      res.status(400).json({
        error: [
          {
            path: "transactionId",
            msg: "You cannot change the status of a transaction that is already approved or rejected.",
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
export default validateTransactionPending;
