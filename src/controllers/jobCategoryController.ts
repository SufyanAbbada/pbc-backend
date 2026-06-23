import JobCategoryRepository from "../repositories/JobCategoryRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import generateSlug from "../utils/nameToSlugConverter";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { Request, Response } from "express";

class JobCategoryController {
  async addJobCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const jobCategory = await JobCategoryRepository.addJobCategory({
        name,
        slug: await generateSlug(name),
      });

      return res.status(201).json({
        message: "Job category created successfully",
        data: jobCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllJobCategories(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { jobCategories, totalCount } =
        await JobCategoryRepository.getAllJobCategories(page, limit);

      const response: PaginationResponse = {
        message: "Job categories fetched successfully",
        data: jobCategories,
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

  async getJobCategoryById(req: Request, res: Response) {
    try {
      const { jobCategoryId } = req.params;
      const jobCategory = await JobCategoryRepository.getJobCategoryById(
        Number(jobCategoryId),
      );

      if (!jobCategory) {
        return res.status(404).json({
          error: [
            {
              path: "id",
              msg: "We couldn't find a job category with this ID. Please check the ID and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Job category fetched successfully",
        data: jobCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateJobCategory(req: Request, res: Response) {
    try {
      const { jobCategoryId } = req.params;
      const { name } = req.body;

      const updatedJobCategory = await JobCategoryRepository.updateJobCategory(
        Number(jobCategoryId),
        {
          name,
          slug: await generateSlug(name),
        },
      );

      return res.status(200).json({
        message: "Job category updated successfully",
        data: updatedJobCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteJobCategory(req: Request, res: Response) {
    try {
      const { jobCategoryId } = req.params;

      const deletedJobCategory = await JobCategoryRepository.deleteJobCategory(
        Number(jobCategoryId),
      );

      return res.status(200).json({
        message: "Job category has been removed",
        data: deletedJobCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new JobCategoryController();
