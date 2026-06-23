import prisma from "../config/prismaClient";
import { Transaction } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { GeneralStatus, UpdateGeneralStatus } from "../common/enums";

class TransactionRepository {
  async addTransaction(transactionData: Transaction) {
    return prisma.transaction.create({
      data: transactionData,
    });
  }

  async getAllTransactions(
    sortBy: { field: string; order: "asc" | "desc" } = {
      field: "updatedAt",
      order: "desc",
    },
    userId?: number,
    page?: number,
    limit?: number,
    status?: GeneralStatus,
  ) {
    const skip = calculatePaginationSkip(page, limit);
    const where = {
      ...(userId && { userId }),
      ...(status && { status }),
    };

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where,
        omit: { notes: true },
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: { [sortBy.field]: sortBy.order },
      }),
      prisma.transaction.count({ where }),
    ]);

    return { transactions, totalCount };
  }

  async getTransactionById(transactionId: number) {
    return prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        category: true,
      },
    });
  }

  async updateTransactionStatus(
    transactionId: number,
    status: UpdateGeneralStatus,
  ) {
    return prisma.transaction.update({
      where: { id: transactionId },
      data: { status },
    });
  }

  async updateTransaction(
    transactionId: number,
    transactionData: Partial<Transaction>,
  ) {
    return prisma.transaction.update({
      where: { id: transactionId },
      data: transactionData,
    });
  }

  async filterTransactions(
    filters: Partial<Transaction>,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: filters,
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.transaction.count({
        where: filters,
      }),
    ]);

    return { transactions, totalCount };
  }

  async getTransactionsByUserId(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          category: true,
        },
      }),
      prisma.transaction.count({ where: { userId } }),
    ]);

    return { transactions, totalCount };
  }

  async getTransactionsByCategoryId(categoryId: number) {
    return prisma.transaction.findMany({
      where: { categoryId },
    });
  }

  async getTransactionByIdAndUserId(transactionId: number, userId: number) {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId, userId },
    });
    return !!transaction;
  }

  async deleteTransactionbyId(transactionId: number) {
    return prisma.transaction.delete({ where: { id: transactionId } });
  }
}

export default new TransactionRepository();
