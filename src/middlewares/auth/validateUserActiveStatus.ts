import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after "validateUserExistenceByIdParam" middleware as it depends on it
const validateUserActiveStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { targetUser } = req.body;

    if (targetUser.isActive) {
      res.status(403).json({
        error: [
          {
            path: "isActive",
            msg: "User is already Active. You cannot reject an active user.",
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

export default validateUserActiveStatus;
