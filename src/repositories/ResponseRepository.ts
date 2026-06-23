import prisma from "../config/prismaClient";
import { Response } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class ResponseRepository {
  async createResponse(data: Response) {
    return await prisma.response.create({ data });
  }

  async getResponses(
    page?: number,
    limit?: number,
    filters?: Partial<Response>,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const [responses, totalCount] = await Promise.all([
      prisma.response.findMany({
        where: { ...filters },
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              Role: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
      prisma.response.count({
        where: { ...filters },
      }),
    ]);

    return { responses, totalCount };
  }

  async getResponseById(responseId: number) {
    return await prisma.response.findUnique({
      where: { id: responseId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            Role: true,
          },
        },
      },
    });
  }

  async getResponsesByTicketId(ticketId: number) {
    return await prisma.response.findMany({
      where: { ticketId },
    });
  }

  async deleteResponse(responseId: number) {
    return await prisma.response.delete({
      where: { id: responseId },
    });
  }

  async getResponseByIdAndUserId(responseId: number, userId: number) {
    const response = await prisma.response.findUnique({
      where: { id: responseId, userId },
    });
    return !!response;
  }
}

export default new ResponseRepository();
