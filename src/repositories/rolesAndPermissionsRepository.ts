import prisma from "../config/prismaClient";
import { BasicUser } from "../common/types";

class RolesAndPermissionsRepository {
  async getUserRoles(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Role: {
          select: {
            name: true,
            permissions: {
              select: {
                action: { select: { name: true } },
                subject: true,
                permission: true,
              },
            },
          },
        },
      },
    });
  }

  async getRole(roleName: string) {
    return await prisma.role.findUnique({
      where: { name: roleName },
    });
  }

  async getAllRoles() {
    return prisma.role.findMany();
  }
}

export default new RolesAndPermissionsRepository();
