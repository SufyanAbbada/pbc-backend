import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction } from "express";
import { TaskStatus } from "../../common/enums";

// * This middleware must be used after the task existence middleware
const validateTaskPendingStatus = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { task } = req.body;

    if (task.status !== TaskStatus.PENDING) {
      res.status(403).json({
        error: [
          {
            path: "status",
            msg: "This task cannot be updated because it is no longer in PENDING state",
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

export default validateTaskPendingStatus;
