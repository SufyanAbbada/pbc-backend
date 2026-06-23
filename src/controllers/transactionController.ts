import TransactionRepository from "../repositories/TransactionRepository";
import ZohoService from "../services/zohoService";
import S3Service from "../services/s3Service";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse, Transaction } from "../common/types";
import { paginate } from "../utils/pagination";
import { AssetTypes, RoleId } from "../common/enums";

class TransactionController {
  async addTransaction(req: Request, res: Response) {
    try {
      const {
        user: { id },
        title,
        categoryId,
        amount,
        notes,
        primaryImage,
        secondaryImage,
      } = req.body;

      const newZohoExpense = await ZohoService.addExpense({
        date: new Date().toISOString().split("T")[0],
        amount: Number(amount),
        description: title,
        user_name: req.body.user.name,
        employee_id: String(id),
      });

      const transaction = await TransactionRepository.addTransaction({
        zohoExpenseId: newZohoExpense.expense_id,
        title,
        notes,
        primaryImage: await S3Service.uploadAsset(
          primaryImage,
          AssetTypes.DOCUMENTS,
        ),
        secondaryImage: secondaryImage
          ? await S3Service.uploadAsset(secondaryImage, AssetTypes.DOCUMENTS)
          : undefined,
        amount: Number(amount),
        categoryId: Number(categoryId),
        userId: Number(id),
      });

      return res.status(201).json({
        message: "Transaction created successfully",
        data: transaction,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTransaction(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const { title, categoryId, amount, notes, primaryImage, secondaryImage } =
        req.body;

      const updatedTransaction = await TransactionRepository.updateTransaction(
        Number(transactionId),
        {
          title,
          ...(categoryId && { categoryId: Number(categoryId) }),
          ...(amount && { amount: Number(amount) }),
          notes,
          primaryImage: primaryImage
            ? await S3Service.uploadAsset(primaryImage, AssetTypes.DOCUMENTS)
            : undefined,
          secondaryImage: secondaryImage
            ? await S3Service.uploadAsset(secondaryImage, AssetTypes.DOCUMENTS)
            : undefined,
        },
      );

      return res.status(206).json({
        message: "Transaction updated successfully",
        data: updatedTransaction,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTransactionStatus(req: Request, res: Response) {
    try {
      const { transactionId } = req.params;
      const { status } = req.body;

      const updatedTransaction =
        await TransactionRepository.updateTransactionStatus(
          Number(transactionId),
          status,
        );

      return res.status(206).json({
        message: "Transaction status updated successfully",
        data: updatedTransaction,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getTransactions(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        filters: { sortBy, status },
      } = req.body;

      const { transactions, totalCount } =
        await TransactionRepository.getAllTransactions(
          sortBy,
          undefined,
          page,
          limit,
          status,
        );

      const response: PaginationResponse = {
        message: "Transactions fetched successfully",
        data: transactions,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getTransactionByUserId(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user: { id: userId },
      } = req.body;

      const { transactions, totalCount } =
        await TransactionRepository.getTransactionsByUserId(
          Number(userId),
          page,
          limit,
        );

      const response: PaginationResponse = {
        message: "Transactions fetched successfully",
        data: transactions,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getTransactionById(req: Request, res: Response) {
    try {
      const transaction = await TransactionRepository.getTransactionById(
        Number(req.params.transactionId),
      );

      if (!transaction) {
        return res.status(404).json({
          error: [
            {
              path: "transactionId",
              msg: "We couldn't find the transaction you're looking for. Please recheck the details",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Transaction fetched successfully",
        data: transaction,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async filterTransactions(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        title,
        amount,
        status,
        categoryId,
        createdAt,
        updatedAt,
      } = req.body;

      const filters: Partial<Transaction> = {};

      Object.assign(filters, {
        ...(title && { title }),
        ...(amount && { amount: Number(amount) }),
        ...(status && { status }),
        ...(categoryId && { categoryId: Number(categoryId) }),
        ...(createdAt && { createdAt }),
        ...(updatedAt && { updatedAt }),
      });

      const { transactions, totalCount } =
        await TransactionRepository.filterTransactions(filters, page, limit);

      const response: PaginationResponse = {
        message: "Transactions filtered successfully",
        data: transactions,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteTransactionbyId(req: Request, res: Response) {
    try {
      const transaction = await TransactionRepository.deleteTransactionbyId(
        Number(req.params.transactionId),
      );

      return res.status(200).json({
        message: "Transaction has been removed",
        data: transaction,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new TransactionController();
