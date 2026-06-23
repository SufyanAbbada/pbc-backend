import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware should only be placed after "validateTokenExistence" middleware as it depends upon it
const validateTokenOwnership: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, pushNotificationToken } = req.body;

    if (Number(user.id) !== pushNotificationToken?.userId) {
      res.status(403).json({
        error: [
          {
            path: "tokenId",
            msg: "You don't have permission to manage this token. Users can only manage their own tokens.",
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

export default validateTokenOwnership;
