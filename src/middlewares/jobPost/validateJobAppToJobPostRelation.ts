import JobApplicationRepository from "../../repositories/JobApplicationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobAppToJobPostRelation: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobPostId = req.params?.jobPostId || req.body?.jobPostId;
  const { jobApplicationId } = req.body;

  const jobApplication = await JobApplicationRepository.getJobApplicationById(
    Number(jobApplicationId),
  );

  if (jobApplication?.jobPost.id !== Number(jobPostId)) {
    res.status(400).json({
      error: [
        {
          path: "jobPostId",
          msg: "Job application is not associated to the job post",
        },
      ],
    });
    return;
  }

  next();
};

export default validateJobAppToJobPostRelation;
