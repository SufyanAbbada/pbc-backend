import JobPostRepository from "../../repositories/JobPostRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobPostExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobPostId = req.params?.jobPostId || req.body?.jobPostId;

  if (jobPostId) {
    const jobPost = await JobPostRepository.getJobPostById(Number(jobPostId));

    if (!jobPost) {
      res.status(404).json({
        error: [
          {
            path: "jobPostId",
            msg: "We couldn’t find the Job post. Please check the Job post ID",
          },
        ],
      });
      return;
    }

    next();
  } else next();
};

export default validateJobPostExistence;
