import ProductRepository from "../../repositories/ProductRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateProductExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const productId =
      source === SourceType.BODY ? req.body.productId : req.params.productId;

    if (productId) {
      const product = await ProductRepository.getProductById(Number(productId));

      if (!product) {
        res.status(404).json({
          error: [
            {
              path: "productId",
              msg: "We couldn’t find this product. Please recheck the product ID",
            },
          ],
        });
        return;
      }

      req.body.product = product;
    }

    next();
  };
};
export default validateProductExistence;
