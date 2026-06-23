import prisma from "../config/prismaClient";
import { Policy } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class PolicyRepository {
  async addPolicy(PolicyData: Policy) {
    return await prisma.policy.create({ data: PolicyData });
  }

  async getAllPolicies(page: number, limit: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [policies, totalCount] = await Promise.all([
      prisma.policy.findMany({
        skip,
        take: limit,
      }),
      prisma.policy.count(),
    ]);

    return { policies, totalCount };
  }

  async getPolicyById(id: number) {
    return await prisma.policy.findUnique({
      where: { id },
    });
  }

  async updatePolicy(id: number, policyData?: Partial<Policy>) {
    return await prisma.policy.update({
      where: { id },
      data: {
        title: policyData?.title,
        description: policyData?.description,
        status: policyData?.status,
      },
    });
  }

  async deletePolicy(id: number) {
    return await prisma.policy.delete({ where: { id } });
  }

  async getPolicyByIdAndUserId(id: number, userId: number) {
    const policy = await prisma.policy.findUnique({
      where: { id, userId },
    });
    return !!policy;
  }
}

export default new PolicyRepository();
