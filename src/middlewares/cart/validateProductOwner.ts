import ProductRepository from "../../repositories/ProductRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateProductOwner = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;
    const productId =
      source === SourceType.BODY ? req.body.productId : req.params.productId;

    const product = await ProductRepository.getProductById(Number(productId));

    if (product?.userId === user.id) {
      res.status(403).json({
        error: [
          {
            path: "productId",
            msg: "You cannot add your own product to the cart.",
          },
        ],
      });
      return;
    }

    req.body.product = product;

    next();
  };
};
export default validateProductOwner;
