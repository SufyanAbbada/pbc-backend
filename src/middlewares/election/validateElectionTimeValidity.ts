import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateElectionTimeValidity: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { election } = req.body;

    if (
      election.endDate.getTime() < Date.now() ||
      election.startDate.getTime() > Date.now()
    ) {
      res.status(400).json({
        error: [
          {
            path: "election",
            msg: "The Election has not started yet or has already ended. You cannot cast your vote now.",
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

export default validateElectionTimeValidity;
