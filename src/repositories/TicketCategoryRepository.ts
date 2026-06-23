import prisma from "../config/prismaClient";
import { TicketCategory } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class TicketCategoryRepository {
  async addTicketCategory(category: TicketCategory) {
    return await prisma.ticketCategory.create({ data: category });
  }

  async getAllTicketCategories(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [ticketCategories, totalCount] = await Promise.all([
      prisma.ticketCategory.findMany({
        skip,
        take: limit,
      }),
      prisma.ticketCategory.count(),
    ]);

    return { ticketCategories, totalCount };
  }

  async getTicketCategoryById(id: number) {
    return await prisma.ticketCategory.findUnique({
      where: { id },
    });
  }

  async getTicketCategoryByName(name: string) {
    return await prisma.ticketCategory.findUnique({
      where: { name },
    });
  }

  async slugExists(slug: string): Promise<boolean> {
    const existingTicketCategory = await prisma.ticketCategory.findUnique({
      where: { slug },
    });
    return !!existingTicketCategory;
  }

  async updateTicketCategory(id: number, ticketCategoryData: TicketCategory) {
    return await prisma.ticketCategory.update({
      where: { id },
      data: ticketCategoryData,
    });
  }

  async deleteTicketCategory(id: number) {
    return await prisma.ticketCategory.delete({ where: { id } });
  }
}

export default new TicketCategoryRepository();
