import prisma from "../config/prismaClient";
import { JobApplication } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class JobApplicationRepository {
  async applyForJob(applicationData: JobApplication) {
    return await prisma.jobApplication.create({ data: applicationData });
  }

  async getAllJobApplications(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [jobApplications, totalCount] = await Promise.all([
      prisma.jobApplication.findMany({
        skip,
        take: limit,
        include: {
          jobPost: { select: { id: true, title: true } },
        },
      }),
      prisma.jobApplication.count(),
    ]);

    return { jobApplications, totalCount };
  }

  async getJobApplicationById(jobApplicationId: number) {
    return await prisma.jobApplication.findUnique({
      where: { id: jobApplicationId },
      include: {
        jobPost: { select: { id: true, title: true } },
      },
    });
  }
}

export default new JobApplicationRepository();
