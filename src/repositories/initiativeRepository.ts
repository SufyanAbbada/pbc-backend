import prisma from "../config/prismaClient";
import { Initiative } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { InitiativeStatus } from "../common/enums";

class InitiativeRepository {
  async createInitiative(initiativeData: Initiative) {
    return await prisma.initiative.create({
      data: initiativeData,
    });
  }

  async getAllInitiatives(
    page?: number,
    limit?: number,
    status?: InitiativeStatus,
    userId?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const whereClause = {
      ...(status && { status }),
      ...(userId && { userId }),
    };

    const [initiatives, totalCount] = await Promise.all([
      prisma.initiative.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
        },
      }),
      prisma.initiative.count({
        where: whereClause,
      }),
    ]);

    return { initiatives, totalCount };
  }

  async updateInitiative(initiativeId: number, data: Partial<Initiative>) {
    return await prisma.initiative.update({
      where: { id: initiativeId },
      data,
    });
  }

  async getInitiativeById(initiativeId: number) {
    return await prisma.initiative.findUnique({
      where: { id: initiativeId },
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

  async getInitiativeByIdAndUserId(initiativeId: number, userId: number) {
    const initiative = await prisma.initiative.findUnique({
      where: { id: initiativeId, userId },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return !!initiative;
  }

  async deleteInitiative(initiativeId: number) {
    return await prisma.initiative.delete({
      where: { id: initiativeId },
    });
  }
}

export default new InitiativeRepository();
