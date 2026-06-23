import prisma from "../config/prismaClient";
import { Wishlist } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { WishlistStatus } from "../common/enums";
import { Prisma } from "@prisma/client";

class WishlistRepository {
  async createWishlist(wishlistData: Wishlist) {
    return await prisma.wishlist.create({
      data: wishlistData,
    });
  }

  async getAllWishlists(
    page?: number,
    limit?: number,
    sortBy?: { field: string; order: "asc" | "desc" },
    status?: WishlistStatus,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const where: {
      status?: WishlistStatus;
    } = {};
    if (status) {
      where.status = status;
    }

    let orderBy: { [key: string]: "asc" | "desc" } = { updatedAt: "desc" };
    if (sortBy) {
      orderBy = { [sortBy.field]: sortBy.order };
    }

    const [wishlists, totalCount] = await Promise.all([
      prisma.wishlist.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { name: true } },
        },
      }),
      prisma.wishlist.count({ where }),
    ]);

    return { wishlists, totalCount };
  }

  async getWishlistsByUserId(
    userId: number,
    page?: number,
    limit?: number,
    sortBy?: { field: string; order: "asc" | "desc" },
    status?: WishlistStatus,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const where: {
      status?: WishlistStatus;
      userId: number;
    } = {
      userId,
    };
    if (status) {
      where.status = status;
    }

    let orderBy: { [key: string]: "asc" | "desc" } = { updatedAt: "desc" };
    if (sortBy) {
      orderBy = { [sortBy.field]: sortBy.order };
    }

    const [wishlists, totalCount] = await Promise.all([
      prisma.wishlist.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: { select: { name: true } },
        },
      }),
      prisma.wishlist.count({
        where,
      }),
    ]);

    return { wishlists, totalCount };
  }

  async updateWishlist(wishlistId: number, data: Partial<Wishlist>) {
    return await prisma.wishlist.update({
      where: { id: wishlistId },
      data,
    });
  }

  async getWishlistById(wishlistId: number) {
    return await prisma.wishlist.findUnique({
      where: { id: wishlistId },
      include: {
        user: {
          select: { name: true },
        },
        responses: {
          include: {
            user: { select: { id: true, name: true, Role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async deleteWishlist(wishlistId: number) {
    return await prisma.wishlist.delete({
      where: { id: wishlistId },
    });
  }

  async getWishlistByIdAndUserId(wishlistId: number, userId: number) {
    const wishlist = await prisma.wishlist.findUnique({
      where: { id: wishlistId, userId },
      include: {
        responses: {
          include: {
            user: { select: { id: true, name: true, Role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
    return !!wishlist;
  }

  async getFilteredWishlists(userId: number, status: WishlistStatus) {
    const [wishlists, totalCount] = await Promise.all([
      prisma.wishlist.findMany({
        where: {
          userId,
          status,
        },
        include: {
          user: { select: { name: true } },
        },
      }),
      prisma.wishlist.count({
        where: {
          userId,
          status,
        },
      }),
    ]);

    return { wishlists, totalCount };
  }

  async searchWishlists(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.WishlistWhereInput = {
      OR: [
        { title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          suggestions: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          comment: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
        },
        {
          user: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
      ],
    };

    const [wishlists, totalCount] = await Promise.all([
      prisma.wishlist.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.wishlist.count({ where }),
    ]);

    return { wishlists, totalCount };
  }
}

export default new WishlistRepository();
