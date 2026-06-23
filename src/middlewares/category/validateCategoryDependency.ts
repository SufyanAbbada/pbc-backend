import ProductRepository from "../../repositories/ProductRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateCategoryDependency = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const categoryId =
      source === SourceType.BODY ? req.body.categoryId : req.params.categoryId;

    const { products } = await ProductRepository.getCategorizedProducts(
      Number(categoryId),
    );

    if (products.length > 0) {
      res.status(403).json({
        error: [
          {
            path: "categoryId",
            msg: "You cannot delete this category as some products are associated with it.",
          },
        ],
      });
      return;
    }

    next();
  };
};
export default validateCategoryDependency;
