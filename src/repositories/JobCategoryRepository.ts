import prisma from "../config/prismaClient";
import { JobCategory } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class JobCategoryRepository {
  async addJobCategory(category: JobCategory) {
    return await prisma.jobCategory.create({ data: category });
  }

  async getAllJobCategories(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [jobCategories, totalCount] = await Promise.all([
      prisma.jobCategory.findMany({
        skip,
        take: limit,
      }),
      prisma.jobCategory.count(),
    ]);

    return { jobCategories, totalCount };
  }

  async getJobCategoryById(id: number) {
    return await prisma.jobCategory.findUnique({ where: { id } });
  }

  async getJobCategoryByName(name: string) {
    return await prisma.jobCategory.findUnique({ where: { name } });
  }

  async slugExists(slug: string): Promise<boolean> {
    const existingJobCategory = await prisma.jobCategory.findUnique({
      where: { slug },
    });
    return !!existingJobCategory;
  }

  async updateJobCategory(id: number, jobCategoryData: JobCategory) {
    return await prisma.jobCategory.update({
      where: { id },
      data: jobCategoryData,
    });
  }

  async deleteJobCategory(id: number) {
    return await prisma.jobCategory.delete({ where: { id } });
  }
}

export default new JobCategoryRepository();
