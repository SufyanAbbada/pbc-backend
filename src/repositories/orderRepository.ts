import prisma from "../config/prismaClient";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class OrderRepository {
  async getAllOrders(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
      }),
      prisma.order.count(),
    ]);

    return { orders, totalCount };
  }

  async getSingleOrder(orderId: number) {
    return prisma.order.findUnique({ where: { id: orderId } });
  }

  async getUserOrders(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
      }),
      prisma.order.count({ where: { userId } }),
    ]);

    return { orders, totalCount };
  }

  async getOrderByIdAndUserId(orderId: number, userId: number) {
    const order = await prisma.order.findUnique({
      where: { id: orderId, userId },
    });
    return !!order;
  }

  async getOrderByTransactionId(transactionId: string) {
    return prisma.order.findUnique({ where: { transactionId } });
  }

  async getOrdersByAddressId(addressId: number) {
    return prisma.order.findMany({ where: { addressId } });
  }
}

export default new OrderRepository();
