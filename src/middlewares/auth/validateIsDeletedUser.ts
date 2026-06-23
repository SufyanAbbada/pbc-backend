import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after "validateUserExistenceByEmail" middleware as it depends on it
const validateUserDeletionStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req.body;

    if (user.isDeleted) {
      res.status(404).json({
        error: [
          {
            path: "email",
            msg: "We couldn't find a user with this email. Please double-check the email",
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

export default validateUserDeletionStatus;
