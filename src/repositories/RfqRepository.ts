import prisma from "../config/prismaClient.js";
import { RfqData } from "../common/types";
import { RFQStatus, Prisma } from "@prisma/client";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip.js";

class RfqRepository {
  async createRfq(rfqData: RfqData) {
    return await prisma.rFQ.create({
      data: rfqData,
    });
  }

  async getRfqById(rfqId: number) {
    return await prisma.rFQ.findUnique({
      where: { id: rfqId },
      include: {
        quotes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
            responses: {
              include: {
                user: { select: { id: true, name: true, Role: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
        product: true,
      },
    });
  }

  async getRfqByQuoteId(quoteId: number) {
    return await prisma.rFQ.findFirst({
      where: { quotes: { some: { id: quoteId } } },
    });
  }

  async getAllOpenRfq(userId: number) {
    return await prisma.rFQ.findMany({
      where: { status: "OPEN", userId },
      include: {
        quotes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }

  async getMyRfq(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [rfqs, totalCount] = await Promise.all([
      prisma.rFQ.findMany({
        where: { userId },
        skip,
        take: limit,
        include: {
          quotes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rFQ.count({ where: { userId } }),
    ]);

    return { rfqs, totalCount };
  }

  async getAllRfq(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [rfqs, totalCount] = await Promise.all([
      prisma.rFQ.findMany({
        skip,
        take: limit,
        include: {
          quotes: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rFQ.count(),
    ]);

    return { rfqs, totalCount };
  }

  async updateRfqById(rfqId: number, rfqData: RfqData) {
    return await prisma.rFQ.update({
      where: { id: rfqId },
      data: { ...rfqData },
    });
  }

  async updateRfqStatus(rfqId: number, status: RFQStatus) {
    return await prisma.rFQ.update({
      where: { id: rfqId },
      data: { status },
    });
  }

  async addAwardedQuoteId(rfqId: number, awardedQuoteId: number) {
    return await prisma.rFQ.update({
      where: { id: rfqId },
      data: { awardedQuoteId, status: RFQStatus.AWARDED },
    });
  }

  async deleteRfqById(rfqId: number) {
    return await prisma.rFQ.delete({ where: { id: rfqId } });
  }

  async awardedRFQs(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [rfqs, totalCount] = await Promise.all([
      prisma.rFQ.findMany({
        where: {
          quotes: {
            some: {
              userId: userId,
              isAwarded: true,
            },
          },
        },
        include: {
          awardedQuote: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.rFQ.count({
        where: {
          quotes: {
            some: {
              userId: userId,
              isAwarded: true,
            },
          },
        },
      }),
    ]);

    return { rfqs, totalCount };
  }

  async getRfqByIdAndUserId(id: number, userId: number) {
    const rfq = await prisma.rFQ.findUnique({
      where: { id, userId },
    });
    return !!rfq;
  }

  async searchRfqs(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.RFQWhereInput = {
      OR: [
        { title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          description: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          categoryName: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          user: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
      ],
    };

    const [rfqs, totalCount] = await Promise.all([
      prisma.rFQ.findMany({
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
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.rFQ.count({ where }),
    ]);

    return { rfqs, totalCount };
  }
}

export default new RfqRepository();
