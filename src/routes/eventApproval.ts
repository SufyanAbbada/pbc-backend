import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateEnumField from "../middlewares/global/validateStatus";
import EventApprovalController from "../controllers/eventApprovalController";
import validateEventExistence from "../middlewares/event/validateEventExistence";
import validateUserApprovalExistence from "../middlewares/eventApproval/validateUserApprovalExistence";
import validateMOMExistence from "../middlewares/eventApproval/validateEventMOMExistence";
import validateEventMOMResolution from "../middlewares/eventApproval/validateEventMomResolution";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateEventEnded from "../middlewares/event/validateIsEventEnded";
import validatePermissions from "../middlewares/global/validatePermissions";
import {
  Action,
  EventMOMApprovalStatus,
  SourceType,
  Subject,
} from "../common/enums";
import { Router, Request, Response } from "express";
import validateOwnEventMOMApproval from "../middlewares/transaction/validateOwnEventMOMApproval";

const eventApprovalRouter = Router();

eventApprovalRouter.post(
  "/:eventId",
  [
    ...validateToken,
    ...validateId("eventId"),
    ...validateEnumField("status", EventMOMApprovalStatus),
    ...validateOptional("comment"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.EVENT_APPROVAL),
  validateEventExistence(SourceType.PARAM),
  validateOwnEventMOMApproval,
  validateUserApprovalExistence,
  validateMOMExistence,
  validateEventMOMResolution,
  async (req: Request, res: Response) => {
    await EventApprovalController.approveOrRejectMOM(req, res);
  },
);

eventApprovalRouter.get(
  "/:eventId",
  [...validateToken, ...validateId("eventId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT_APPROVAL),
  validateEventExistence(SourceType.PARAM),
  validateEventEnded,
  async (req: Request, res: Response) => {
    await EventApprovalController.getApprovals(req, res);
  },
);

export default eventApprovalRouter;
