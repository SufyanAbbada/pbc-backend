import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction } from "express";

// * This middleware must be used after the assignee user existence middleware
const validateSelfAssigned = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      assignees,
      user: { id: assignerId },
    } = req.body;

    if (assignees.includes(assignerId)) {
      res.status(400).json({
        error: [
          {
            path: "assigneeId",
            msg: "You cannot assign a task to yourself. Please select a different user to assign this task to.",
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

export default validateSelfAssigned;
