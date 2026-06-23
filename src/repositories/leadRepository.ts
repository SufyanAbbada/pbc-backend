import prisma from "../config/prismaClient";
import { Lead } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { Prisma } from "@prisma/client";

class LeadRepository {
  async addLead(leadData: Lead) {
    return prisma.lead.create({ data: leadData });
  }

  async getAllLead(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          createdAt: true,
          Buyer: {
            select: {
              name: true,
              id: true,
            },
          },
          Seller: {
            select: {
              name: true,
              id: true,
            },
          },
          Product: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      }),
      prisma.lead.count(),
    ]);

    return { leads, totalCount };
  }

  async getUserLead(
    userId: number,
    isMyLeads: boolean,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const itemsToSelect = {
      id: true,
      status: true,
      createdAt: true,
      Product: {
        select: {
          name: true,
          id: true,
        },
      },
    };

    isMyLeads
      ? Object.assign(itemsToSelect, {
          Buyer: {
            select: {
              name: true,
              id: true,
            },
          },
        })
      : Object.assign(itemsToSelect, {
          Seller: {
            select: {
              name: true,
              id: true,
            },
          },
        });

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where: { buyerId: userId },
        skip,
        take: limit,
        select: itemsToSelect,
      }),
      prisma.lead.count({
        where: { buyerId: userId },
      }),
    ]);

    return { leads, totalCount };
  }

  async getLeadByIdAndUserId(leadId: number, userId: number) {
    const lead = await prisma.lead.findUnique({
      where: { id: leadId, buyerId: userId },
    });
    return !!lead;
  }

  async getLeadsByProductId(productId: number) {
    const lead = await prisma.lead.findMany({
      where: { productId },
    });
    return lead;
  }

  async searchLeads(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.LeadWhereInput = {
      OR: [
        {
          Buyer: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
        {
          Seller: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
        {
          Product: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
      ],
    };

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        include: {
          Buyer: {
            select: {
              name: true,
              id: true,
            },
          },
          Seller: {
            select: {
              name: true,
              id: true,
            },
          },
          Product: {
            select: {
              name: true,
              id: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.lead.count({ where }),
    ]);
    return { leads, totalCount };
  }

  async getUserProductLeads(
    userId: number,
    productId: number,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const [leads, totalCount] = await Promise.all([
      prisma.lead.findMany({
        where: {
          sellerId: userId,
          productId,
        },
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          createdAt: true,
          Buyer: {
            select: { name: true, id: true },
          },
          Product: {
            select: { name: true, id: true },
          },
        },
      }),
      prisma.lead.count({
        where: {
          buyerId: userId,
          productId,
        },
      }),
    ]);

    return { leads, totalCount };
  }
}

export default new LeadRepository();
