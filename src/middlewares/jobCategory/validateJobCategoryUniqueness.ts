import JobCategoryRepository from "../../repositories/JobCategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateJobCategoryUniqueness: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  const existingJobCategory =
    await JobCategoryRepository.getJobCategoryByName(name);

  if (existingJobCategory) {
    res.status(400).json({
      error: [
        {
          path: "name",
          msg: "Job category name already exists. Please choose a different and unique name.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateJobCategoryUniqueness;
