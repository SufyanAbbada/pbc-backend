import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after "validateUserExistenceByEmail" middleware as it depends on it
const validateUserActivation: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req.body;

    if (!user.isActive || !user.isEnabled) {
      res.status(403).json({
        error: [
          {
            path: "isActive",
            msg: "Your account is inactive. You cannot access any resource in the system at the moment.",
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

export default validateUserActivation;
