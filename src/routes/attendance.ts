import attendanceController from "../controllers/attendanceController";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validateLocation from "../middlewares/global/validateLocation";
import validateAttendanceExistence from "../middlewares/attendance/validateAttendanceExistence";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateAttendancePresence from "../middlewares/attendance/validateAttendancePresence";
import validateAttendanceClockedOut from "../middlewares/attendance/validateAttendanceClockedOut";
import validateUserExistenceByIdParam from "../middlewares/auth/validateUserExistenceByIdParam";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const attendanceRouter = Router();

attendanceRouter.post(
  "/clock-in",
  [...validateLocation, ...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.ATTENDANCE),
  validateAttendanceExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.clockIn(req, res);
  },
);

attendanceRouter.post(
  "/clock-out",
  [...validateLocation, ...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.ATTENDANCE),
  validateAttendancePresence,
  validateAttendanceClockedOut,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.clockOut(req, res);
  },
);

attendanceRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ATTENDANCE),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.getAllAttendances(req, res);
  },
);

attendanceRouter.get(
  "/my",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ATTENDANCE),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.getMyAttendances(req, res);
  },
);

attendanceRouter.get(
  "/todays",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ATTENDANCE),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.getTodayAttendance(req, res);
  },
);

attendanceRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateId("userId"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ATTENDANCE),
  validateUserExistenceByIdParam,
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.getUserAttendances(req, res);
  },
);

attendanceRouter.patch(
  "/update-tasks",
  [...validateTitles("tasks"), ...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.ATTENDANCE),
  validateAttendancePresence,
  validateAttendanceClockedOut,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await attendanceController.updateTodaysTasks(req, res);
  },
);

export default attendanceRouter;
