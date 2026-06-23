import prisma from "../config/prismaClient";
import { Vote } from "../common/types";

class VoteRepository {
  async addVote(voteData: Vote) {
    return prisma.vote.create({
      data: voteData,
      include: {
        election: {
          select: {
            title: true,
            description: true,
            type: true,
            startDate: true,
            endDate: true,
            policyId: true,
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
              },
            },
          },
        },
      },
    });
  }

  async getVoteByColumn(column: keyof Vote, value: string | number) {
    return await prisma.vote.findFirst({
      where: {
        [column]: value,
      },
    });
  }

  async getVoteByUserOnElection(userId: number, electionId: number) {
    return await prisma.vote.findFirst({
      where: {
        userId,
        electionId,
      },
    });
  }

  async getAllVotesByElectionId(electionId: number, includeUsers = false) {
    return await prisma.vote.findMany({
      where: {
        electionId,
      },
      include: {
        user: includeUsers,
      },
    });
  }
}

export default new VoteRepository();
