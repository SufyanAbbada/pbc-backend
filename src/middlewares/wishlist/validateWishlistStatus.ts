import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { WishlistStatus } from "../../common/enums";

// * This middleware should only be placed after "validateWishlistExistence" middleware as it depends upon it
const validateWishlistStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { wishlist } = req.body;

    if (wishlist.status !== WishlistStatus.PENDING) {
      res.status(403).json({
        error: [
          {
            path: "wishlistStatus",
            msg: "You cannot update an in-active wishlist",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateWishlistStatus;
