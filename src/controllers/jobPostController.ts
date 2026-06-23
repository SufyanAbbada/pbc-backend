import JobPostRepository from "../repositories/JobPostRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { PaginationResponse } from "../common/types";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";
import { prependProtocol } from "../utils/prependProtocol";

class JobPostController {
  async addJobPost(req: Request, res: Response) {
    try {
      let {
        title,
        description,
        deadline,
        jobCategoryId,
        minExperience,
        maxExperience,
        minSalary,
        maxSalary,
        jobType,
        jobMode,
        location,
        linkedInProfile,
        twitterProfile,
        skills,
        user: { id: userId },
      } = req.body;

      linkedInProfile = prependProtocol(linkedInProfile);
      twitterProfile = prependProtocol(twitterProfile);

      const jobPost = await JobPostRepository.addJobPost({
        title,
        description,
        deadline: deadline,
        jobCategoryId: Number(jobCategoryId),
        userId: Number(userId),
        location,
        linkedInProfile,
        twitterProfile,
        skills,
        jobMode,
        jobType,
        ...(minExperience && { minExperience: Number(minExperience) }),
        ...(maxExperience && { maxExperience: Number(maxExperience) }),
        ...(minSalary && { minSalary: Number(minSalary) }),
        ...(maxSalary && { maxSalary: Number(maxSalary) }),
      });

      return res.status(201).json({
        message: "Job post created successfully",
        data: jobPost,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllJobPosts(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { jobPosts, totalCount } = await JobPostRepository.getAllJobPosts(
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Job Posts fetched successfully",
        data: jobPosts,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getJobPostsByUserId(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        sort,
        filter,
        user: { id: userId },
      } = req.body;

      const { jobPosts, totalCount } =
        await JobPostRepository.getJobPostsByUserId(
          Number(userId),
          page,
          limit,
          sort,
          filter,
        );

      const response: PaginationResponse = {
        message: "Job Posts fetched successfully",
        data: jobPosts,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getJobPostById(req: Request, res: Response) {
    try {
      const { jobPostId } = req.params;

      const jobPost = await JobPostRepository.getJobPostById(Number(jobPostId));

      if (!jobPost) {
        return res.status(404).json({
          error: [
            {
              path: "jobPostId",
              msg: "We couldn't find a Job post with this ID. Please check the ID and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Job post fetched successfully",
        data: jobPost,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getPublicJobPostById(req: Request, res: Response) {
    try {
      const { jobPostId } = req.params;

      const jobPost = await JobPostRepository.getPublicJobPostById(
        Number(jobPostId),
      );

      if (!jobPost) {
        return res.status(404).json({
          error: [
            {
              path: "jobPostId",
              msg: "We couldn't find a Job post with this ID. Please check the ID and try again.",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Job post fetched successfully",
        data: jobPost,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateJobPost(req: Request, res: Response) {
    try {
      const { jobPostId } = req.params;
      const {
        title,
        description,
        deadline,
        jobCategoryId,
        minExperience,
        maxExperience,
        minSalary,
        maxSalary,
        jobMode,
        jobType,
        location,
      } = req.body;

      const updatedJobPost = await JobPostRepository.updateJobPost(
        Number(jobPostId),
        {
          title,
          description,
          deadline,
          ...(jobCategoryId && { jobCategoryId: Number(jobCategoryId) }),
          jobMode,
          jobType,
          location,
          ...(minExperience && { minExperience: Number(minExperience) }),
          ...(maxExperience && { maxExperience: Number(maxExperience) }),
          ...(minSalary && { minSalary: Number(minSalary) }),
          ...(maxSalary && { maxSalary: Number(maxSalary) }),
        },
      );

      return res.status(200).json({
        message: "Job post updated successfully",
        data: updatedJobPost,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async acceptJobApplication(req: Request, res: Response) {
    try {
      const { jobPostId } = req.params;
      const { jobApplicationId } = req.body;

      const { jobPost, jobApplication } =
        await JobPostRepository.acceptJobApplication(
          Number(jobPostId),
          Number(jobApplicationId),
        );

      return res.status(200).json({
        message: "Job application accepted successfully",
        data: { jobPost, jobApplication },
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async rejectJobApplication(req: Request, res: Response) {
    try {
      const { jobApplicationId } = req.body;

      const rejectedJobApplication =
        await JobPostRepository.rejectJobApplication(Number(jobApplicationId));

      return res.status(200).json({
        message: "Job application rejected successfully",
        data: rejectedJobApplication,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async searchJobPosts(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { jobPosts, totalCount } = await JobPostRepository.searchJobPosts(
        search as string,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Search results for job posts fetched successfully",
        data: jobPosts,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new JobPostController();
