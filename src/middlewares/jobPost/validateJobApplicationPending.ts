import JobApplicationRepository from "../../repositories/JobApplicationRepository";
import { JobApplicationStatus } from "../../common/enums";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobApplicationPending: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobApplicationId =
    req.params?.jobApplicationId || req.body?.jobApplicationId;

  const jobApplication = await JobApplicationRepository.getJobApplicationById(
    Number(jobApplicationId),
  );

  if (jobApplication?.status !== JobApplicationStatus.PENDING) {
    res.status(400).json({
      error: [
        {
          path: "jobApplicationId",
          msg: "Job application is already accepted or rejected.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateJobApplicationPending;
