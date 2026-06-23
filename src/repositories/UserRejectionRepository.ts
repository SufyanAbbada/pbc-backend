import prisma from "../config/prismaClient";
import { UserRejection } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { Prisma } from "@prisma/client";

class UserRejectionRepository {
  async createNewRejectedUser(rejectionData: UserRejection) {
    return await prisma.userRejection.create({
      data: rejectionData,
    });
  }

  async findRejectedUserByEmail(email: string) {
    return await prisma.userRejection.findFirst({
      where: { email },
    });
  }

  async findRejectedUserByPhoneNumber(phoneNumber: string) {
    return await prisma.userRejection.findFirst({
      where: { phoneNumber },
    });
  }

  async getAllRejectedUsers(
    searchTerm?: string,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const where = searchTerm
      ? {
          OR: [
            {
              email: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              phoneNumber: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              reason: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
            {
              rejectedBy: {
                contains: searchTerm,
                mode: Prisma.QueryMode.insensitive,
              },
            },
          ],
        }
      : {};

    const [rejections, totalCount] = await Promise.all([
      prisma.userRejection.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.userRejection.count({ where }),
    ]);

    return { rejections, totalCount };
  }

  async getRejectedUserById(id: number) {
    return await prisma.userRejection.findUnique({
      where: { id },
    });
  }

  async updateRejectedUser(id: number, rejectionData: Partial<UserRejection>) {
    return await prisma.userRejection.update({
      where: { id },
      data: rejectionData,
    });
  }

  async deleteRejectedUser(id: number) {
    return await prisma.userRejection.delete({
      where: { id },
    });
  }
}

export default new UserRejectionRepository();
