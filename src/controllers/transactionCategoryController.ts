import TransactionCategoryRepository from "../repositories/TransactionCategoryRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import generateSlug from "../utils/nameToSlugConverter";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { CategoryType } from "../common/enums";
import { paginate } from "../utils/pagination";

class TransactionCategoryController {
  async addTransactionCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;

      const transactionCategory =
        await TransactionCategoryRepository.addTransactionCategory({
          name,
          slug: await generateSlug(name, CategoryType.TRANSACTION),
        });

      return res.status(201).json({
        message: "Transaction Category created successfully",
        data: transactionCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllTransactionCategories(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { categories, totalCount } =
        await TransactionCategoryRepository.getAllTransactionCategories(
          page,
          limit,
        );

      const response: PaginationResponse = {
        message: "Transaction Categories fetched successfully",
        data: categories,
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

  async getTransactionCategoryById(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;

      const transactionCategory =
        await TransactionCategoryRepository.getTransactionCategoryById(
          Number(categoryId),
        );

      if (!transactionCategory) {
        return res.status(404).json({
          error: [
            {
              path: "categoryId",
              msg: "We couldn't find the transaction category you're looking for. Please check the details",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Transaction Category fetched successfully",
        data: transactionCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTransactionCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const { name } = req.body;

      const updatedTransactionCategory =
        await TransactionCategoryRepository.updateTransactionCategory(
          Number(categoryId),
          {
            name,
            slug: await generateSlug(name, CategoryType.TRANSACTION),
          },
        );

      return res.status(206).json({
        message: "Transaction Category updated successfully",
        data: updatedTransactionCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteTransactionCategory(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;

      const deletedTransactionCategory =
        await TransactionCategoryRepository.deleteTransactionCategory(
          Number(categoryId),
        );

      return res.status(206).json({
        message: "Transaction Category has been removed",
        data: deletedTransactionCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new TransactionCategoryController();
