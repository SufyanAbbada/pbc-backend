import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction } from "express";
import { Task } from "../../common/types";

// * This middleware must be used after the task & user existence middleware
const validateTaskAssignment = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, task } = req.body;

    const isAssignee = task.assignees?.some(
      (assignee: Task["assignees"]["connect"][0]) =>
        Number(assignee.id) === Number(user.id),
    );

    const isAssigner = Number(task.assignerId) === Number(user.id);

    if (!isAssignee && !isAssigner) {
      res.status(403).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this task. Only the assigned or assigner user can update the task status.",
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

export default validateTaskAssignment;
