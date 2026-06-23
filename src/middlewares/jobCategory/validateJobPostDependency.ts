import JobPostRepository from "../../repositories/JobPostRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateJobCategoryDependency = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const jobCategoryId =
      source === SourceType.BODY
        ? req.body.jobCategoryId
        : req.params.jobCategoryId;

    const jobPosts = await JobPostRepository.getJobPostsByCategoryId(
      Number(jobCategoryId),
    );

    if (jobPosts.length > 0) {
      res.status(403).json({
        error: [
          {
            path: "jobCategoryId",
            msg: "You cannot delete this job category as it is associated with some job posts.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateJobCategoryDependency;
