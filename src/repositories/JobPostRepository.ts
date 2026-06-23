import prisma from "../config/prismaClient";
import { JobPost } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { JobApplicationStatus, JobStatus, SortOrder } from "../common/enums";
import { Prisma } from "@prisma/client";

class JobPostRepository {
  async addJobPost(jobPostData: JobPost) {
    const { skills, ...rest } = jobPostData;

    return await prisma.jobPost.create({
      data: {
        ...rest,
        skills: {
          connect: skills.map((id: number) => ({ id })),
        },
      },
    });
  }

  async getAllJobPosts(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [jobPosts, totalCount] = await Promise.all([
      prisma.jobPost.findMany({
        where: { status: JobStatus.OPEN },
        skip,
        take: limit,
        include: {
          jobCategory: {
            select: { id: true, name: true },
          },
          user: {
            select: { id: true, name: true },
          },
          skills: true,
          _count: {
            select: { JobApplication: true },
          },
        },
      }),
      prisma.jobPost.count({ where: { status: JobStatus.OPEN } }),
    ]);

    return { jobPosts, totalCount };
  }

  async getJobPostsByUserId(
    userId: number,
    page?: number,
    limit?: number,
    sort?: SortOrder,
    filter?: JobStatus,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const [jobPosts, totalCount] = await Promise.all([
      prisma.jobPost.findMany({
        where: {
          userId,
          ...(filter ? { status: filter } : {}),
        },
        skip,
        take: limit,
        orderBy: sort ? { createdAt: sort } : undefined,
        include: {
          jobCategory: {
            select: { id: true, name: true },
          },
          user: {
            select: { id: true, name: true },
          },
          skills: true,
          _count: {
            select: { JobApplication: true },
          },
        },
      }),
      prisma.jobPost.count({
        where: {
          userId,
          ...(filter ? { status: filter } : {}),
        },
      }),
    ]);

    return { jobPosts, totalCount };
  }

  async closeJobPosts() {
    return await prisma.jobPost.updateMany({
      where: {
        deadline: {
          lte: new Date(),
        },
      },
      data: {
        status: JobStatus.CLOSED,
      },
    });
  }

  async getJobPostById(jobPostId: number) {
    return await prisma.jobPost.findUnique({
      where: { id: jobPostId },
      include: {
        jobCategory: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
        JobApplication: true,
        acceptedJobApplication: true,
        skills: true,
      },
    });
  }

  async getPublicJobPostById(jobPostId: number) {
    return await prisma.jobPost.findUnique({
      where: { id: jobPostId },
      include: {
        jobCategory: {
          select: { id: true, name: true },
        },
        user: {
          select: { id: true, name: true },
        },
        skills: true,
        _count: {
          select: { JobApplication: true },
        },
      },
    });
  }

  async acceptJobApplication(jobPostId: number, jobApplicationId: number) {
    const [jobPost, jobApplication] = await Promise.all([
      prisma.jobPost.update({
        where: { id: jobPostId },
        data: {
          acceptedJobApplicationId: jobApplicationId,
          status: JobStatus.FILLED,
        },
      }),
      prisma.jobApplication.update({
        where: { id: jobApplicationId },
        data: {
          status: JobApplicationStatus.ACCEPTED,
        },
      }),
    ]);

    return { jobPost, jobApplication };
  }

  async rejectJobApplication(jobApplicationId: number) {
    return await prisma.jobApplication.update({
      where: { id: jobApplicationId },
      data: {
        status: JobApplicationStatus.REJECTED,
      },
    });
  }

  async updateJobPost(
    jobPostId: number,
    jobPostData: Omit<Partial<JobPost>, "skills">,
  ) {
    return await prisma.jobPost.update({
      where: { id: jobPostId },
      data: jobPostData,
    });
  }

  async getJobPostByIdAndUserId(jobPostId: number, userId: number) {
    const jobPost = await prisma.jobPost.findUnique({
      where: { id: jobPostId, userId },
    });
    return !!jobPost;
  }

  async getJobPostsByCategoryId(jobCategoryId: number) {
    return prisma.jobPost.findMany({
      where: { jobCategoryId },
    });
  }

  async searchJobPosts(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.JobPostWhereInput = {
      OR: [
        { title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          description: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [jobPosts, totalCount] = await Promise.all([
      prisma.jobPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.jobPost.count({ where }),
    ]);

    return { jobPosts, totalCount };
  }
}

export default new JobPostRepository();
