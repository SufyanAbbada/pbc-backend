import prisma from "../config/prismaClient";

class RoleRepository {
  async createRole(role: string) {
    return prisma.role.create({
      data: { name: role },
    });
  }

  async createAction(action: string) {
    return prisma.action.create({
      data: { name: action },
    });
  }
}

export default new RoleRepository();
