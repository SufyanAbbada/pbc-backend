import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after election existence middleware.
const validateElectionActive: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { election } = req.body;

    if (
      election.startDate.getTime() < Date.now() &&
      election.endDate.getTime() > Date.now()
    ) {
      res.status(403).json({
        error: [
          {
            path: "election",
            msg: "This election is currently active. You cannot perform this operation until it has ended",
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

export default validateElectionActive;
