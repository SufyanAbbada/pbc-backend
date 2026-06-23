import wishlistRepository from "../../repositories/wishlistRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { WishlistStatus } from "../../common/enums";

const validateUserWishlistLimit: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req.body;
    const { totalCount } = await wishlistRepository.getFilteredWishlists(
      user.id,
      WishlistStatus.PENDING,
    );

    if (totalCount >= 2) {
      res.status(403).json({
        error: [
          {
            path: "wishlist",
            msg: "You cannot create another wishlist. A user can only have two active wishlists at a time",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateUserWishlistLimit;
