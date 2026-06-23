import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after election existence middleware.
const validateElectionStartTime: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { election } = req.body;

    if (election.startDate.getTime() > Date.now()) {
      res.status(403).json({
        error: [
          {
            path: "election",
            msg: "This election has not started yet. You cannot perform this action at the moment.",
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

export default validateElectionStartTime;
