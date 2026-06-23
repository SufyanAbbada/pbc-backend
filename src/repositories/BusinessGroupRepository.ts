import prisma from "../config/prismaClient";
import { BusinessGroup } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class BusinessGroupRepository {
  async createBusinessGroup(businessGroup: BusinessGroup) {
    return await prisma.businessGroup.create({
      data: businessGroup,
    });
  }

  async getAllBusinessGroups(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [businessGroups, totalCount] = await Promise.all([
      prisma.businessGroup.findMany({
        skip,
        take: limit,
      }),
      prisma.businessGroup.count(),
    ]);

    return { businessGroups, totalCount };
  }

  async getBusinessGroupById(id: number) {
    return await prisma.businessGroup.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });
  }

  async getBusinessGroupByName(name: string) {
    return await prisma.businessGroup.findUnique({
      where: { name },
    });
  }

  async updateBusinessGroup(id: number, data: Partial<BusinessGroup>) {
    return await prisma.businessGroup.update({
      where: { id },
      data,
    });
  }

  async deleteBusinessGroup(id: number) {
    return await prisma.businessGroup.delete({
      where: { id },
    });
  }
}

export default new BusinessGroupRepository();
