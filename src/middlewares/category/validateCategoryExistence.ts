import CategoryRepository from "../../repositories/CategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateCategoryExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const categoryId =
      source === SourceType.BODY ? req.body.categoryId : req.params.categoryId;

    const category = await CategoryRepository.getCategoryById(
      Number(categoryId),
    );

    if (!category) {
      res.status(404).json({
        error: [
          {
            path: "categoryId",
            msg: "We couldn’t find the category. Please check the category ID and try again",
          },
        ],
      });
      return;
    }

    next();
  };
};
export default validateCategoryExistence;
