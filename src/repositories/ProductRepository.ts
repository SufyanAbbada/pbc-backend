import prisma from "../config/prismaClient";
import { ProductData } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { Prisma } from "@prisma/client";

class ProductRepository {
  async addProduct(productData: ProductData) {
    return await prisma.product.create({
      data: productData,
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
  }
  async getAllProducts(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const products = await prisma.product.findMany({
      skip,
      take: limit,
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    const totalCount = await prisma.product.count();

    return { products, totalCount };
  }

  async getAllUserProducts(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const products = await prisma.product.findMany({
      where: { userId },
      skip,
      take: limit,
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    const totalCount = await prisma.product.count({
      where: { userId },
    });

    return { products, totalCount };
  }
  async getCategorizedProducts(
    categoryId: number,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const products = await prisma.product.findMany({
      where: { categoryId },
      skip,
      take: limit,
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
      },
    });

    const totalCount = await prisma.product.count({
      where: { categoryId },
    });

    return { products, totalCount };
  }

  async getProductById(id: number) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            profile: { select: { profilePicture: true } },
          },
        },
        category: { select: { name: true } },
      },
    });
  }

  async getProductByNameAndCategory(name: string, categoryId: number) {
    return await prisma.product.findFirst({
      where: { name, categoryId },
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
  }

  async updateProduct(id: number, productData: Partial<ProductData>) {
    return await prisma.product.update({
      where: { id },
      data: productData,
      include: {
        user: { select: { name: true } },
        category: { select: { name: true } },
      },
    });
  }

  async getProductByIdAndUserId(id: number, userId: number) {
    const product = await prisma.product.findUnique({
      where: { id, userId },
    });
    return !!product;
  }

  async deleteProduct(id: number) {
    return await prisma.product.delete({ where: { id } });
  }

  async searchProducts(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.ProductWhereInput = {
      OR: [
        { name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          description: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [products, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return { products, totalCount };
  }
}

export default new ProductRepository();
