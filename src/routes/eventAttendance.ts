import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validatePermissions from "../middlewares/global/validatePermissions";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import eventAttendanceController from "../controllers/eventAttendanceController";
import validateArrayField from "../middlewares/global/validateArray";
import validateUsersAssignedToEvent from "../middlewares/eventAttendance/validateUsersAssignedToEvent";
import validateEventExistenceForAttendance from "../middlewares/eventAttendance/validateEventExistenceForAttendance";
import validateAttendanceTiming from "../middlewares/eventAttendance/validateEventAttendanceTiming";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const eventAttendanceRouter = Router();

eventAttendanceRouter.patch(
  "/:eventId",
  [...validateToken, ...validateArrayField("userIds", "int"), validate],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.EVENT_ATTENDANCE),
  validateUserVerification("isMembershipVerified"),
  validateEventExistenceForAttendance(),
  validateAttendanceTiming,
  validateUsersAssignedToEvent,
  async (req: Request, res: Response) => {
    await eventAttendanceController.addAttendance(req, res);
  },
);

eventAttendanceRouter.get(
  "/:eventId",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT_ATTENDANCE),
  validateUserVerification("isMembershipVerified"),
  validateEventExistenceForAttendance(),
  async (req: Request, res: Response) => {
    await eventAttendanceController.getEventAttendance(req, res);
  },
);

export default eventAttendanceRouter;
