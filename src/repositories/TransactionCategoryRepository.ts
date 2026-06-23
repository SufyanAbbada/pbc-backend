import prisma from "../config/prismaClient";
import { TransactionCategory } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class TransactionCategoryRepository {
  async addTransactionCategory(transactionCategoryData: TransactionCategory) {
    return prisma.transactionCategory.create({ data: transactionCategoryData });
  }

  async getAllTransactionCategories(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [categories, totalCount] = await Promise.all([
      prisma.transactionCategory.findMany({
        skip,
        take: limit,
      }),
      prisma.transactionCategory.count(),
    ]);

    return { categories, totalCount };
  }

  async getTransactionCategoryById(id: number) {
    return prisma.transactionCategory.findUnique({ where: { id } });
  }

  async getTransactionCategoryByName(name: string) {
    return prisma.transactionCategory.findUnique({ where: { name } });
  }

  async slugExists(slug: string): Promise<boolean> {
    return !!(await prisma.transactionCategory.findUnique({
      where: { slug },
    }));
  }

  async updateTransactionCategory(
    id: number,
    transactionCategoryData: TransactionCategory,
  ) {
    return prisma.transactionCategory.update({
      where: { id },
      data: transactionCategoryData,
    });
  }

  async deleteTransactionCategory(id: number) {
    return prisma.transactionCategory.delete({ where: { id } });
  }
}

export default new TransactionCategoryRepository();
