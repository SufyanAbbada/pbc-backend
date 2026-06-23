import JobApplicationRepository from "../../repositories/JobApplicationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobApplicationExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobApplicationId =
    req.params?.jobApplicationId || req.body?.jobApplicationId;

  if (jobApplicationId) {
    const jobApplication = await JobApplicationRepository.getJobApplicationById(
      Number(jobApplicationId),
    );

    if (!jobApplication) {
      res.status(404).json({
        error: [
          {
            path: "jobApplicationId",
            msg: "We couldn't find the Job application. Please check the Job application ID",
          },
        ],
      });
      return;
    }

    next();
  } else next();
};

export default validateJobApplicationExistence;
