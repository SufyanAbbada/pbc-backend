import wishlistRepository from "../../repositories/wishlistRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateWishlistExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const wishlistId =
      source === SourceType.BODY ? req.body.wishlistId : req.params.wishlistId;

    const wishlist = await wishlistRepository.getWishlistById(
      Number(wishlistId),
    );

    if (!wishlist) {
      res.status(404).json({
        error: [
          {
            path: "wishlistId",
            msg: "We couldn’t find this wishlist. Please recheck the wishlist ID",
          },
        ],
      });
      return;
    }

    req.body.wishlist = wishlist;

    next();
  };
};
export default validateWishlistExistence;
