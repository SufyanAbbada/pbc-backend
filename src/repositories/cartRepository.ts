import prisma from "../config/prismaClient";
import { roundToTwoDecimals } from "../utils/roundToTwoDecimal";
import { Prisma } from "@prisma/client";
import { CartItem } from "../common/types";
import { Order } from "../common/types";

class CartRepository {
  async getCart(userId: number) {
    return prisma.cart.findUnique({ where: { userId } });
  }

  async getCartByIdAndUserId(cartId: number, userId: number) {
    const cart = prisma.cart.findUnique({
      where: { id: cartId, userId },
    });
    return !!cart;
  }

  async addToCart(
    userId: number,
    items: CartItem[],
    originalPrice: number,
    discountedPrice: number,
  ) {
    return prisma.cart.upsert({
      where: { userId },
      update: {
        items: items as unknown as Prisma.JsonArray,
        originalPrice: roundToTwoDecimals(originalPrice),
        discountedPrice: roundToTwoDecimals(discountedPrice),
      },
      create: {
        userId,
        items: items as unknown as Prisma.JsonArray,
        originalPrice: roundToTwoDecimals(originalPrice),
        discountedPrice: roundToTwoDecimals(discountedPrice),
      },
    });
  }

  async applyOrRemoveDiscountOnCart(
    userId: number,
    discountedPrice: number,
    discountValue: number,
    isDiscountApplied: boolean,
  ) {
    return await prisma.cart.update({
      where: { userId },
      data: {
        discountedPrice: roundToTwoDecimals(discountedPrice),
        discountValue,
        isDiscountApplied,
      },
    });
  }

  async clearCart(userId: number) {
    return prisma.cart.delete({
      where: { userId },
    });
  }

  async checkout(orderData: Order) {
    return prisma.order.create({
      data: {
        ...orderData,
        items: orderData.items as unknown as Prisma.JsonArray,
      },
    });
  }
}

export default new CartRepository();
