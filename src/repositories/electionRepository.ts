import prisma from "../config/prismaClient";
import { Election } from "../common/types";
import { ElectionStatus, ElectionType } from "../common/enums";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { Prisma } from "@prisma/client";

class ElectionRepository {
  async addElection(electionData: Election) {
    return prisma.election.create({
      data: electionData,
      include: {
        candidates: {
          select: {
            id: true,
            name: true,
          },
        },
        policy: {
          select: {
            id: true,
            title: true,
            description: true,
            type: true,
            status: true,
          },
        },
      },
    });
  }

  async getElectionById(electionId: number) {
    return prisma.election.findUnique({
      where: {
        id: electionId,
      },
      include: {
        candidates: {
          select: {
            id: true,
            name: true,
          },
        },
        policy: {
          include: {
            article: true,
          },
        },
      },
    });
  }

  async getElectionByPolicyId(policyId: number) {
    return prisma.election.findMany({
      where: {
        policyId,
      },
    });
  }

  async deleteElection(electionId: number) {
    return prisma.election.delete({
      where: {
        id: electionId,
      },
    });
  }

  async getAllElections(
    type?: ElectionType,
    status?: ElectionStatus,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const electionStatus: { endDate?: { gt?: Date; lt?: Date } } = {};

    if (status === ElectionStatus.OPEN) {
      electionStatus.endDate = {
        gt: new Date(),
      };
    } else if (status === ElectionStatus.CLOSED) {
      electionStatus.endDate = {
        lt: new Date(),
      };
    }

    const [elections, totalCount] = await Promise.all([
      prisma.election.findMany({
        where: {
          type: type,
          ...electionStatus,
        },
        include: {
          candidates: {
            select: {
              id: true,
              name: true,
            },
          },
          policy: true,
          votes: { select: { userId: true } },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.election.count({
        where: {
          type: type,
          ...electionStatus,
        },
      }),
    ]);

    return { elections, totalCount };
  }

  async updateElection(electionId: number, electionData: Partial<Election>) {
    return prisma.election.update({
      where: { id: electionId },
      data: {
        ...electionData,
      },
      include: {
        candidates: {
          select: {
            id: true,
            name: true,
          },
        },
        policy: true,
      },
    });
  }

  async searchElections(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where = {
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

    const [elections, totalCount] = await Promise.all([
      prisma.election.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.election.count({ where }),
    ]);

    return { elections, totalCount };
  }
}

export default new ElectionRepository();
