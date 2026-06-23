import CategoryRepository from "../../repositories/CategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateCategoryUniqueness: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  const existingCategory = await CategoryRepository.getCategoryByName(name);

  if (existingCategory) {
    res.status(400).json({
      error: [
        {
          path: "name",
          msg: "The category name already exists. Please choose a different and a unique name",
        },
      ],
    });
    return;
  }

  next();
};

export default validateCategoryUniqueness;
