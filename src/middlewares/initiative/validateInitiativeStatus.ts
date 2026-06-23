import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { InitiativeStatus } from "../../common/enums";

// * This middleware should only be placed after "validateInitiativeExistence" middleware as it depends upon it
const validateInitiativeStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { initiative } = req.body;

    if (
      initiative.status === InitiativeStatus.FINISHED ||
      initiative.status === InitiativeStatus.ABORTED
    ) {
      res.status(403).json({
        error: [
          {
            path: "initiativeStatus",
            msg: `Only initiatives that are ${InitiativeStatus.PLANNED} or ${InitiativeStatus.ON_GOING} can be updated.`,
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

export default validateInitiativeStatus;
