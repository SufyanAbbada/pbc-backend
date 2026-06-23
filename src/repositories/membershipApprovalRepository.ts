import prisma from "../config/prismaClient";
import { MembershipApproval } from "../common/types";

class MembershipApprovalRepository {
  async addMembershipApproval(MembershipApprovalData: MembershipApproval) {
    return prisma.membershipApproval.create({
      data: MembershipApprovalData,
      include: { membership: { include: { user: true } } },
    });
  }

  async getMembershipApprovalsByMembershipId(membershipId: number) {
    return prisma.membershipApproval.findMany({
      where: { membershipId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            Role: true,
          },
        },
      },
    });
  }

  async getMembershipApprovalByUserRole(membershipId: number, roleId: number) {
    return prisma.membershipApproval.findMany({
      where: {
        membershipId,
        user: {
          roleId,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            Role: true,
          },
        },
      },
    });
  }
}

export default new MembershipApprovalRepository();
