import prisma from "../config/prismaClient";
import { MembershipType } from "../common/types";
import { GeneralStatus, UpdateGeneralStatus } from "../common/enums";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class MembershipRepository {
  async createNewMembership(membershipData: MembershipType) {
    return await prisma.membership.create({
      data: {
        ...membershipData,
        businessGroup: {
          connect: membershipData?.businessGroup.map((id) => ({ id })),
        },
      },
    });
  }

  async getMembershipById(membershipId: number) {
    return await prisma.membership.findUnique({
      where: {
        id: membershipId,
      },
      include: {
        MembershipApproval: true,
        businessGroup: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            Role: true,
            profile: true,
          },
        },
      },
    });
  }

  async getMembershipByUserId(userId: number) {
    return await prisma.membership.findUnique({
      where: {
        userId,
      },
      include: {
        MembershipApproval: true,
        businessGroup: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getAllMemberships(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [memberships, totalCount] = await Promise.all([
      prisma.membership.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          status: true,
          companyName: true,
          professionalTitle: true,
          createdAt: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.membership.count(),
    ]);

    return { memberships, totalCount };
  }

  async updateMembershipStatus(id: number, status: UpdateGeneralStatus) {
    return await prisma.membership.update({
      where: { id },
      // * Will need to determine whether to store in Dubai timezone or UTC
      data: { status, decision_at: new Date() },
    });
  }

  async createSubscriptionId(userId: number, subscriptionId: string) {
    return await prisma.membership.update({
      where: { userId },
      data: { subscriptionId },
    });
  }

  async updatePaymentStatus(subscriptionId: string, paymentVerified: boolean) {
    return await prisma.membership.update({
      where: { subscriptionId },
      data: { paymentVerified },
    });
  }

  async getMembershipByColumn(column: keyof MembershipType, value: string) {
    return await prisma.membership.findFirst({
      where: {
        [column]: value,
      },
    });
  }

  async getMembershipByIdAndUserId(membershipId: number, userId: number) {
    const membership = await prisma.membership.findUnique({
      where: { id: membershipId, userId },
    });
    return !!membership;
  }

  async getApprovedAndInRangeMemberships(lowerBound: Date, upperBound: Date) {
    return await prisma.membership.findMany({
      where: {
        status: GeneralStatus.APPROVED,
        OR: [
          {
            passportExpiryDate: {
              gt: lowerBound,
              lt: upperBound,
            },
          },
          {
            emiratesIdExpiryDate: {
              gt: lowerBound,
              lt: upperBound,
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }
}

export default new MembershipRepository();
