import JobPostRepository from "../../repositories/JobPostRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobPostToUserRelation: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobPostId = req.params?.jobPostId || req.body?.jobPostId;
  const { id } = req.body.user;

  const jobPost = await JobPostRepository.getJobPostById(Number(jobPostId));

  if (jobPost?.userId !== id) {
    res.status(400).json({
      error: [
        {
          path: "jobPostId",
          msg: "Job post is not assosiated to the user",
        },
      ],
    });
    return;
  }

  next();
};

export default validateJobPostToUserRelation;
