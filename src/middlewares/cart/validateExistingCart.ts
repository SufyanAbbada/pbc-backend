import { Request, Response, NextFunction } from "express";
import cartRepository from "../../repositories/cartRepository";

const validateExistingCart = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user: { id: userId },
  } = req.body;
  const cart = await cartRepository.getCart(Number(userId));

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    res.status(404).json({
      error: [
        {
          path: "userId",
          msg: "We couldn't find a cart for this User. Please double check the user Info",
        },
      ],
    });
    return;
  }

  req.body.cart = cart;
  next();
};

export default validateExistingCart;
