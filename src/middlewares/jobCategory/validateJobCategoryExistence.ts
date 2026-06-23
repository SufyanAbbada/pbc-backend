import JobCategoryRepository from "../../repositories/JobCategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobCategoryExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const jobCategoryId = req.params?.jobCategoryId || req.body?.jobCategoryId;

  if (jobCategoryId) {
    const jobCategory = await JobCategoryRepository.getJobCategoryById(
      Number(jobCategoryId),
    );

    if (!jobCategory) {
      res.status(404).json({
        error: [
          {
            path: "jobCategoryId",
            msg: "We couldn't find the job category. Please check the job category ID",
          },
        ],
      });
      return;
    }

    next();
  } else next();
};

export default validateJobCategoryExistence;
