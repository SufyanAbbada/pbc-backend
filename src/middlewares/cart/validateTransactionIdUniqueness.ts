import orderRepository from "../../repositories/orderRepository";
import { Request, Response, NextFunction } from "express";

const validateTransactionIdUniqueness = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { transactionId } = req.body;

  const order = await orderRepository.getOrderByTransactionId(transactionId);

  if (order) {
    res.status(400).json({
      error: [
        {
          path: "transactionId",
          msg: "The transaction you provided already exists. Please provide a unique one",
        },
      ],
    });
    return;
  }

  next();
};

export default validateTransactionIdUniqueness;
