import prisma from "../config/prismaClient.js";
import { quoteData } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip.js";
import { Prisma } from "@prisma/client";

class QuoteRepository {
  async createQuote(quoteData: quoteData) {
    return await prisma.quote.create({
      data: quoteData,
    });
  }

  async updateQuote(quoteId: number, updateData: Partial<quoteData>) {
    return await prisma.quote.update({
      where: { id: quoteId },
      data: updateData,
    });
  }

  async getQuoteById(quoteId: number) {
    return await prisma.quote.findUnique({
      where: { id: quoteId },
      include: {
        rfq: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
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

  async getQuoteByRfqId(rfqId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [quotes, totalCount] = await Promise.all([
      prisma.quote.findMany({
        where: { rfqId },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true } },
          rfq: {
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
      }),
      prisma.quote.count({ where: { rfqId } }),
    ]);

    return { quotes, totalCount };
  }

  async getAllQuotes(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [quote, totalCount] = await Promise.all([
      prisma.quote.findMany({
        skip,
        take: limit,
        include: {
          rfq: {
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
      }),
      prisma.quote.count(),
    ]);

    return { quote, totalCount };
  }

  async makeQuoteStatusAwarded(quoteId: number) {
    return await prisma.quote.update({
      where: { id: quoteId },
      data: { isAwarded: true },
    });
  }

  async getQuoteByIdAndUserId(id: number, userId: number) {
    const quote = await prisma.quote.findUnique({
      where: { id, userId },
    });
    return !!quote;
  }

  async searchQuotes(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.QuoteWhereInput = {
      OR: [
        {
          description: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          termsAndConditions: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          user: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
        {
          rfq: {
            title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
      ],
    };

    const [quotes, totalCount] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true } },
          rfq: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      }),
      prisma.quote.count({ where }),
    ]);

    return { quotes, totalCount };
  }
}

export default new QuoteRepository();
