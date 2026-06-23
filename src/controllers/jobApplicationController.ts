import JobApplicationRepository from "../repositories/JobApplicationRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import s3Service from "../services/s3Service";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";
import { AssetTypes } from "../common/enums";
import { PaginationResponse } from "../common/types";
import { prependProtocol } from "../utils/prependProtocol";

class JobApplicationController {
  async applyForJob(req: Request, res: Response) {
    try {
      let { jobPostId, resumeDoc, applicantName, linkedInProfile } = req.body;

      linkedInProfile = prependProtocol(linkedInProfile);

      const jobApplication = await JobApplicationRepository.applyForJob({
        jobPostId: Number(jobPostId),
        applicantName,
        linkedInProfile,
        resumeDoc: await s3Service.uploadAsset(resumeDoc, AssetTypes.DOCUMENTS),
      });

      return res.status(201).json({
        message: "Job application submitted successfully",
        data: jobApplication,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllJobApplications(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { jobApplications, totalCount } =
        await JobApplicationRepository.getAllJobApplications(page, limit);

      const response: PaginationResponse = {
        message: "Job Applications fetched successfully",
        data: jobApplications,
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

  async getJobApplicationById(req: Request, res: Response) {
    try {
      const { jobApplicationId } = req.params;

      const jobApplication =
        await JobApplicationRepository.getJobApplicationById(
          Number(jobApplicationId),
        );

      if (!jobApplication) {
        return res.status(404).json({
          error: [
            {
              path: "id",
              msg: "We couldn't find the job application. Please double-check the details and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Job application fetched successfully",
        data: jobApplication,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new JobApplicationController();
