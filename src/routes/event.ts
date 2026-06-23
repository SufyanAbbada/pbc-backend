import EventController from "../controllers/eventController";
import validateToken from "../middlewares/token/validateToken";
import validateId from "../middlewares/global/validateId";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateOptionalDate from "../middlewares/global/validateOptionalDate";
import validatePaginationParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateEventExistence from "../middlewares/event/validateEventExistence";
import validateTitles from "../middlewares/global/validateTitles";
import validateDateField from "../middlewares/global/validateDate";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateIsUserAssignedEvent from "../middlewares/event/validateIsUserAssignedEvent";
import validateStartAndEndDate from "../middlewares/global/validateStartAndEndDate";
import validateArray from "../middlewares/global/validateArray";
import validateUsersExistence from "../middlewares/auth/validateUsersExistence";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import validateIsEventStarted from "../middlewares/event/validateIsEventStarted";
import validateFileUpload from "../middlewares/global/validateFileUpload";
import extractAndParseEventMedia from "../middlewares/event/extractAndParseEventMedia";
import validateOptionalMultipleFileUploads from "../middlewares/global/validateOptionalMultipleFileUploads";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateEnumQueryParam from "../middlewares/global/validateEnumQueryParam";
import validateDateTimeField from "../middlewares/global/validateDateTime";
import validateEnumField from "../middlewares/global/validateStatus";
import validatePrevBoardMeetingEnded from "../middlewares/event/validatePrevBoardMeetingEnded";
import { Router, Request, Response } from "express";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";
import {
  Action,
  AssetTypes,
  DateType,
  EventMOMApprovalStatus,
  EventType,
  SourceType,
  Subject,
} from "../common/enums";

const eventRouter = Router();

eventRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("details"),
    ...validateTitles("venue"),
    ...validateDateTimeField("startDate"),
    ...validateDateTimeField("endDate"),
    ...validateEnumField("eventType", EventType),
    ...validateArray("userIds", "int"),
    ...validateArray("actionPoints", "string", false),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.EVENT),
  validatePrevBoardMeetingEnded(SourceType.BODY),
  validateAndParseDate("startDate", DateType.START),
  validateAndParseDate("endDate", DateType.END),
  validateStartAndEndDate("startDate", "endDate"),
  validateUsersExistence,
  async (req: Request, res: Response) => {
    await EventController.createEvent(req, res);
  },
);

eventRouter.get(
  "/my-events",
  [
    ...validateToken,
    ...validatePaginationParams("page"),
    ...validatePaginationParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await EventController.getMyEvents(req, res);
  },
);

eventRouter.get(
  "/",
  [
    ...validateToken,
    ...validatePaginationParams("page"),
    ...validatePaginationParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await EventController.getEvents(req, res);
  },
);

eventRouter.get(
  "/board-meetings",
  [
    ...validateToken,
    ...validatePaginationParams("page"),
    ...validatePaginationParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await EventController.getBoardMeetingEvents(req, res);
  },
);

eventRouter.get(
  "/event-moms",
  [
    ...validatePaginationParams("page"),
    ...validatePaginationParams("limit"),
    ...validateEnumQueryParam("status", EventMOMApprovalStatus),
    validate,
  ],
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await EventController.getEventsMOM(req, res);
  },
);

eventRouter.get(
  "/my-assigned",
  [
    ...validateToken,
    ...validatePaginationParams("page"),
    ...validatePaginationParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await EventController.getMyAssignedEvents(req, res);
  },
);

eventRouter.get(
  "/my-assigned/:eventId",
  [...validateToken, ...validateId("eventId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT),
  validateEventExistence(SourceType.PARAM),
  validateIsUserAssignedEvent,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await EventController.getMyAssignedEventDetail(req, res);
  },
);

eventRouter.post(
  "/media/:eventId",
  configureMulter(
    Array.from({ length: 20 }, (_, i) => `eventMedia${i + 1}`),
    [AssetTypes.IMAGES, AssetTypes.VIDEOS, AssetTypes.AUDIOS],
  ),
  fileCleanupMiddleware,
  [...validateToken, ...validateId("eventId"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.EVENT),
  validateFileUpload("eventMedia1"),
  validateOptionalMultipleFileUploads(
    Array.from({ length: 19 }, (_, i) => `eventMedia${i + 2}`),
  ),
  validateEventExistence(SourceType.PARAM),
  extractAndParseEventMedia,
  validateIsEventStarted,
  async (req: Request, res: Response) => {
    await EventController.uploadEventMedia(req, res);
  },
);

eventRouter.get(
  "/:eventId",
  [...validateToken, ...validateId("eventId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT),
  validateEventExistence(SourceType.PARAM),
  async (req: Request, res: Response) => {
    await EventController.getEventById(req, res);
  },
);

eventRouter.patch(
  "/mom/:eventId",
  [
    ...validateToken,
    ...validateId("eventId"),
    ...validateTitles("eventMOM"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.EVENT),
  validateEventExistence(SourceType.PARAM),
  validateIsEventStarted,
  async (req: Request, res: Response) => {
    await EventController.updateEventMOM(req, res);
  },
);

eventRouter.patch(
  "/:eventId",
  [
    ...validateToken,
    ...validateId("eventId"),
    ...validateOptional("title"),
    ...validateOptional("venue"),
    ...validateOptional("details"),
    ...validateDateTimeField("startDate", "optional"),
    ...validateDateTimeField("endDate", "optional"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.EVENT),
  validateEventExistence(SourceType.PARAM),
  validateAndParseDate("startDate", DateType.START),
  validateAndParseDate("endDate", DateType.END),
  validateStartAndEndDate("startDate", "endDate"),
  async (req: Request, res: Response) => {
    await EventController.updateEvent(req, res);
  },
);

export default eventRouter;
