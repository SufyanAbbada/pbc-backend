import CategoryRepository from "../../repositories/CategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateCategoryExistenceByName = (field: string): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const value = req.body[field];

    const existingCategory = await CategoryRepository.getCategoryByName(value);

    if (!existingCategory) {
      res.status(400).json({
        error: [
          {
            path: field,
            msg: `We couldn’t find a category with this ${field}. Please choose a valid option`,
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateCategoryExistenceByName;
