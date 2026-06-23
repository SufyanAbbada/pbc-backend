import generalErrorResponse from "../../utils/generalErrorResponse";
import getNextTaskStatus from "../../utils/getNextTaskStatus";
import { Request, Response, NextFunction } from "express";
import { TaskStatus } from "../../common/enums";

// * This middleware must be used after the task & user existence middleware
const validateNextTaskStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { task, status } = req.body;

    if (task.status === TaskStatus.COMPLETED) {
      res.status(406).json({
        error: [
          {
            path: "status",
            msg: `This Task is already completed. Its Status cannot be changed now`,
          },
        ],
      });
      return;
    } else if (task.status === status) {
      res.status(403).json({
        error: [
          {
            path: "status",
            msg: "This task is already in the specified status. Please choose a different status to update",
          },
        ],
      });
      return;
    } else if (status !== getNextTaskStatus(task.status)) {
      res.status(403).json({
        error: [
          {
            path: "status",
            msg: `This task can only transition to the '${getNextTaskStatus(task.status)}' status next.`,
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

export default validateNextTaskStatus;
