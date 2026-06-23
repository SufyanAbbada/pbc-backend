import prisma from "../config/prismaClient";
import { Category } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class CategoryRepository {
  async addCategory(categoryData: Category) {
    return await prisma.category.create({ data: categoryData });
  }
  async getAllCategories(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [categories, totalCount] = await Promise.all([
      prisma.category.findMany({
        skip,
        take: limit,
      }),
      prisma.category.count(),
    ]);

    return { categories, totalCount };
  }

  async getCategoryById(id: number, includeProducts: boolean = false) {
    return await prisma.category.findUnique({
      where: { id },
      include: includeProducts ? { Product: true } : undefined,
    });
  }

  async getCategoryByName(name: string) {
    return await prisma.category.findUnique({ where: { name } });
  }

  async slugExists(slug: string): Promise<boolean> {
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });
    return !!existingCategory;
  }

  async updateCategory(id: number, categoryData: Category) {
    return await prisma.category.update({
      where: { id },
      data: categoryData,
    });
  }

  async deleteCategory(id: number) {
    return await prisma.category.delete({ where: { id } });
  }
}

export default new CategoryRepository();
