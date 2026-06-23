import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after election existence middleware.
const validateElectionEndTime: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { election } = req.body;

    if (election.endDate.getTime() > Date.now()) {
      res.status(403).json({
        error: [
          {
            path: "election",
            msg: "This election hasn’t ended yet. You can view the results once it’s over",
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

export default validateElectionEndTime;
