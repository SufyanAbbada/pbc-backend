import prisma from "../config/prismaClient";
import { Discount } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class DiscountRepository {
  async createDiscount(discountData: Discount) {
    return await prisma.discount.create({ data: discountData });
  }

  async findDiscountById(discountId: number) {
    return await prisma.discount.findUnique({ where: { id: discountId } });
  }

  async getAllDiscounts(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [discounts, totalCount] = await Promise.all([
      prisma.discount.findMany({
        skip,
        take: limit,
      }),
      prisma.discount.count(),
    ]);

    return { discounts, totalCount };
  }

  async deleteDiscountById(discountId: number) {
    return await prisma.discount.delete({ where: { id: discountId } });
  }

  async updateDiscountById(
    discountId: number,
    discountData: Partial<Discount>,
  ) {
    return await prisma.discount.update({
      where: { id: discountId },
      data: { ...discountData },
    });
  }

  async updateDiscountStatus(id: number, isActive: boolean) {
    return await prisma.discount.update({
      where: { id },
      data: { isActive },
    });
  }

  async updateDiscountFeaturedStatus(id: number, isFeatured: boolean) {
    return await prisma.discount.update({
      where: { id },
      data: { isFeatured },
    });
  }

  async findDiscountByCode(discountCode: string) {
    return await prisma.discount.findUnique({ where: { discountCode } });
  }

  async findDiscountByUserId(userId: number) {
    return await prisma.discount.findMany({ where: { userId } });
  }

  async getDiscountByIdAndUserId(id: number, userId: number) {
    const discount = await prisma.discount.findUnique({
      where: { id, userId },
    });
    return !!discount;
  }
}

export default new DiscountRepository();
