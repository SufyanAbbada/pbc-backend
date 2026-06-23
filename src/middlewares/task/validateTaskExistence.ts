import TaskRepository from "../../repositories/TaskRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateTaskExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const taskId =
      source === SourceType.PARAM ? req.params.taskId : req.body.taskId;

    const task = await TaskRepository.getTaskById(Number(taskId));

    if (!task) {
      res.status(404).json({
        error: [
          {
            path: "taskId",
            msg: "We couldn't find this task in our system. Please recheck the task ID",
          },
        ],
      });
      return;
    }

    req.body.task = task;
    next();
  };
};

export default validateTaskExistence;
