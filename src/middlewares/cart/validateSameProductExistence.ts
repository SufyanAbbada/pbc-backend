import { Request, Response, NextFunction } from "express";
import { Cart } from "../../common/types";

const validateSameProductExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { cart, productId } = req.body as { cart?: Cart; productId: string };

  if (!cart) {
    next();
    return;
  }

  const productExists = cart.items.some((item) => item.productId === productId);

  if (productExists) {
    res.status(404).json({
      error: [
        {
          path: "productId",
          msg: "You can't add the same product to the cart twice. Please choose something else",
        },
      ],
    });
    return;
  }

  next();
};

export default validateSameProductExistence;
