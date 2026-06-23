import prisma from "../config/prismaClient";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class JobSkillRepository {
  async addJobSkill(name: string) {
    return await prisma.jobSkill.create({
      data: { name },
    });
  }

  async getAllJobSkills(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [jobSkills, totalCount] = await Promise.all([
      prisma.jobSkill.findMany({
        skip,
        take: limit,
      }),
      prisma.jobSkill.count(),
    ]);

    return { jobSkills, totalCount };
  }

  async getJobSkillById(id: number) {
    return await prisma.jobSkill.findUnique({ where: { id } });
  }

  async getJobSkillByName(name: string) {
    return await prisma.jobSkill.findUnique({ where: { name } });
  }

  async updateJobSkill(id: number, name: string) {
    return await prisma.jobSkill.update({
      where: { id },
      data: { name },
    });
  }
}

export default new JobSkillRepository();
