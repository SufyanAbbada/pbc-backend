import CategoryRepository from "../../repositories/CategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateCategoryAvailability: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  const existingCategory = await CategoryRepository.getCategoryByName(name);

  if (existingCategory && existingCategory.id !== Number(categoryId)) {
    res.status(400).json({
      error: [
        {
          path: "name",
          msg: "Category name already exists. Please choose a different and a unique name.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateCategoryAvailability;
