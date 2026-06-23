import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware should only be placed after "validateWishlistExistence" middleware as it depends upon it
const validateWishlistOwnership: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { wishlist, user } = req.body;

    if (Number(user.id) !== Number(wishlist?.userId)) {
      res.status(403).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this wishlist. User can only update/delete their own wishlist.",
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

export default validateWishlistOwnership;
