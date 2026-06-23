import ProductRepository from "../../repositories/ProductRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateProductOwnership = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const productId =
      source === SourceType.BODY ? req.body.productId : req.params.productId;

    const product = await ProductRepository.getProductById(Number(productId));

    if (product?.userId !== user.id) {
      res.status(403).json({
        error: [
          {
            path: "productId",
            msg: "You can only access the Leads of your own products.",
          },
        ],
      });
      return;
    }

    req.body.product = product;

    next();
  };
};
export default validateProductOwnership;
