import JobPostRepository from "../../repositories/JobPostRepository";
import { JobStatus } from "../../common/enums";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobPostOpen: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobPostId = req.params?.jobPostId || req.body?.jobPostId;

  const jobPost = await JobPostRepository.getJobPostById(Number(jobPostId));

  if (jobPost?.status !== JobStatus.OPEN) {
    res.status(400).json({
      error: [
        {
          path: "jobPostId",
          msg: "The Job post is already filled and is no longer available",
        },
      ],
    });
    return;
  }
  next();
};

export default validateJobPostOpen;
