import cartRepository from "../../repositories/cartRepository";
import { Cart } from "../../common/types";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateCartMerchant: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    product,
    user: { id: userId },
  } = req.body;

  const cart = (await cartRepository.getCart(Number(userId))) as Cart | null;

  // Need to check if cart exists, if not, move to the next middleware, for the first product to be added to the cart
  if (!cart || cart.items.length === 0) {
    next();
    return;
  }

  const cartSellerId = cart.items[0].sellerId;
  if (product.userId !== cartSellerId) {
    res.status(400).json({
      error: [
        {
          path: "sellerId",
          msg: "All products should come from the same seller. Please check and update your selection",
        },
      ],
    });
    return;
  }
  req.body.cart = cart;

  next();
};

export default validateCartMerchant;
