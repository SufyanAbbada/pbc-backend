import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware must be used after the `validateProductExistence` middleware
const validateNotProductOwner = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user, product } = req.body;

    if (product?.userId === user.id) {
      res.status(403).json({
        error: [
          {
            path: "productId",
            msg: "You cannot add your own products to a RFQ. You should select a different user's product.",
          },
        ],
      });
      return;
    }

    next();
  };
};
export default validateNotProductOwner;
