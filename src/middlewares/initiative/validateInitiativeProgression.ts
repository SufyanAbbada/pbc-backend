import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { InitiativeStatus } from "../../common/enums";

const validateInitiativeProgression: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { initiative, status } = req.body;

    if (
      initiative.status === InitiativeStatus.ON_GOING &&
      status === InitiativeStatus.PLANNED
    ) {
      res.status(403).json({
        error: [
          {
            path: "initiativeStatus",
            msg: `Cannot change initiative status from ${InitiativeStatus.ON_GOING} back to ${InitiativeStatus.PLANNED}. Initiative progress should be forward-moving.`,
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

export default validateInitiativeProgression;
