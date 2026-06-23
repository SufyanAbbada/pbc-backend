import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateEnumField from "../middlewares/global/validateStatus";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validatePaginationParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import EventActionPointController from "../controllers/eventActionPointController";
import validateActionPointExistence from "../middlewares/eventActionPoint/validateActionPointExistence";
import validateActionPointCompleted from "../middlewares/eventActionPoint/validateActionPointCompleted";
import validateEventAgainstActionPoint from "../middlewares/eventActionPoint/validateEventAgainstActionPoint";
import {
  Action,
  Subject,
  EventActionPointStatus,
  SourceType,
} from "../common/enums";
import { Router, Request, Response } from "express";

const eventActionPointRouter = Router();

eventActionPointRouter.get(
  "/pending",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.EVENT_ACTION_POINT),
  async (req: Request, res: Response) => {
    await EventActionPointController.getRecentPendingActionPoints(req, res);
  },
);

eventActionPointRouter.patch(
  "/status/:actionPointId",
  [
    ...validateToken,
    ...validateId("actionPointId"),
    ...validateEnumField("status", EventActionPointStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.EVENT_ACTION_POINT),
  validateActionPointCompleted(SourceType.PARAM),
  validateActionPointExistence(SourceType.PARAM),
  validateEventAgainstActionPoint,
  async (req: Request, res: Response) => {
    await EventActionPointController.updateActionPointStatus(req, res);
  },
);

export default eventActionPointRouter;
