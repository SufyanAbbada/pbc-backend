import prisma from "../config/prismaClient";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { Ticket } from "../common/types";
import { TicketPriority, TicketStatus } from "../common/enums";
import { Prisma } from "@prisma/client";

class TicketRepository {
  async createTicket(data: Ticket) {
    return await prisma.ticket.create({ data });
  }

  async getAllTickets(
    page?: number,
    limit?: number,
    status?: TicketStatus,
    priority?: TicketPriority,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const [tickets, totalCount] = await Promise.all([
      prisma.ticket.findMany({
        where: {
          ...(status && { status }),
          ...(priority && { priority }),
        },
        skip,
        take: limit,
        include: {
          user: { select: { name: true, Role: true } },
          category: { select: { name: true } },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.ticket.count({
        where: {
          ...(status && { status }),
        },
      }),
    ]);

    return { tickets, totalCount };
  }

  async getTicketsByUserId(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [tickets, totalCount] = await Promise.all([
      prisma.ticket.findMany({
        where: {
          userId,
        },
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true, Role: true } },
          category: { select: { name: true } },
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      prisma.ticket.count({
        where: {
          userId,
        },
      }),
    ]);

    return { tickets, totalCount };
  }

  async updateTicket(ticketId: number, data: Partial<Ticket>) {
    return await prisma.ticket.update({
      where: { id: ticketId },
      data,
    });
  }

  async getTicketById(ticketId: number, includeRelations: boolean = false) {
    return await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: includeRelations
        ? {
            user: {
              select: { id: true, name: true, Role: true },
            },
            responses: {
              include: {
                user: { select: { id: true, name: true, Role: true } },
              },
              orderBy: { createdAt: "asc" },
            },
            category: { select: { name: true } },
          }
        : undefined,
    });
  }

  async getTicketsByCategoryId(categoryId: number) {
    return await prisma.ticket.findMany({
      where: { categoryId },
    });
  }

  async deleteTicket(ticketId: number) {
    return await prisma.ticket.delete({
      where: { id: ticketId },
    });
  }

  async getTicketByIdAndUserId(ticketId: number, userId: number) {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId, userId },
    });
    return !!ticket;
  }

  async searchTickets(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.TicketWhereInput = {
      OR: [
        { title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          description: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [tickets, totalCount] = await Promise.all([
      prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.ticket.count({ where }),
    ]);

    return { tickets, totalCount };
  }
}

export default new TicketRepository();
