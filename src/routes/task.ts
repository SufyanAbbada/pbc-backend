import TaskController from "../controllers/taskController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateEnumField from "../middlewares/global/validateStatus";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateOptionalEnumField from "../middlewares/global/validateOptionalStatus";
import validateAssigneeUsersExistence from "../middlewares/task/validateAssigneeUsersExistence";
import validateTaskExistence from "../middlewares/task/validateTaskExistence";
import validateTaskAssignment from "../middlewares/task/validateTaskAssignment";
import validateTaskPendingStatus from "../middlewares/task/validateTaskPendingStatus";
import validateSelfAssigned from "../middlewares/task/validateSelfAssigned";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateIds from "../middlewares/global/validateIds";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import mutateApproveAction from "../middlewares/mutateApproveAction";
import validateNextTaskStatus from "../middlewares/task/validateNextTaskStatus";
import { Router, Request, Response } from "express";
import { Action, SourceType, Subject, TaskStatus } from "../common/enums";

const taskRouter = Router();

taskRouter.post(
  "/",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    ...validateIds("assignees", SourceType.BODY, false),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  validateAssigneeUsersExistence,
  validateSelfAssigned,
  async (req: Request, res: Response) => {
    await TaskController.createTask(req, res);
  },
);

taskRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateOptionalEnumField("status", TaskStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await TaskController.getAllTasks(req, res);
  },
);

taskRouter.get(
  "/assigned",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateOptionalEnumField("status", TaskStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await TaskController.getMyAssignedTasks(req, res);
  },
);

taskRouter.get(
  "/assigner",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateOptionalEnumField("status", TaskStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await TaskController.getMyCreatedTasks(req, res);
  },
);

taskRouter.get(
  "/:taskId",
  [...validateToken, ...validateId("taskId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TaskController.getTaskById(req, res);
  },
);

taskRouter.patch(
  "/status/:taskId",
  [
    ...validateToken,
    ...validateId("taskId"),
    ...validateEnumField("status", TaskStatus),
    validate,
  ],
  extractUserFromToken,
  // * These middlewares are commented out because of the issue of task update vs status update.
  // mutateApproveAction,
  // validatePermissions(Action.UPDATE, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  validateTaskExistence(),
  validateTaskAssignment,
  validateNextTaskStatus,
  async (req: Request, res: Response) => {
    await TaskController.updateTaskStatus(req, res);
  },
);

taskRouter.patch(
  "/details/:taskId",
  [
    ...validateToken,
    ...validateId("taskId"),
    ...validateTitles("title"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  validateTaskExistence(),
  validateTaskPendingStatus,
  async (req: Request, res: Response) => {
    await TaskController.updateTaskDetails(req, res);
  },
);

export default taskRouter;
