import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware should only be placed after "validateInitiativeExistence" middleware as it depends upon it
const validateInitiativeOwnership: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { initiative, user } = req.body;

    if (Number(user.id) !== Number(initiative.userId)) {
      res.status(403).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this initiative. User can only interact with their own initiative.",
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

export default validateInitiativeOwnership;
