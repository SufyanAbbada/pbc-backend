import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction } from "express";
import { TaskStatus } from "../../common/enums";

// * This middleware must be used after the task existence middleware
const validateTaskNotCompleted = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { task } = req.body;

    if (task.status === TaskStatus.COMPLETED) {
      res.status(403).json({
        error: [
          {
            path: "status",
            msg: "This task cannot be updated because it is already completed & finished.",
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

export default validateTaskNotCompleted;
