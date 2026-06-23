import ActivityLogController from "../controllers/activityLogController";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validatePaginationParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateOptionalEnumField from "../middlewares/global/validateOptionalStatus";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateEnumQueryParam from "../middlewares/global/validateEnumQueryParam";
import validateOptionalId from "../middlewares/global/validateOptionalId";
import validateOptionalPhone from "../middlewares/global/validateOptionalPhone";
import validateOptionalEmail from "../middlewares/global/validateOptionalEmail";
import validateSubjectExistence from "../middlewares/activityLog/validateSubjectExistence";
import validateContactInfoExistence from "../middlewares/activityLog/validateContactInfo";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Interaction, InteractionType, Subject } from "../common/enums";

const activityLogRouter = Router();

activityLogRouter.post(
  "/",
  [
    ...validateToken,
    ...validateOptionalEnumField("action", Interaction),
    ...validateOptionalPhone,
    ...validateOptionalEmail("email"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.ACTIVITY_LOG),
  validateUserVerification("isMembershipVerified"),
  validateContactInfoExistence,
  validateSubjectExistence,
  async (req: Request, res: Response) => {
    await ActivityLogController.logActivity(req, res);
  },
);

activityLogRouter.get(
  "/",
  [
    ...validateToken,
    ...validateEnumQueryParam("action", Interaction),
    ...validateEnumQueryParam("interactionType", InteractionType),
    ...validateOptionalId("interactedUserId"),
    ...validateOptionalId("observerId"),
    ...validatePaginationParams("page"),
    ...validatePaginationParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ACTIVITY_LOG),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ActivityLogController.getAllActivityLogs(req, res);
  },
);

activityLogRouter.get(
  "/export/csv",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ACTIVITY_LOG),
  async (req: Request, res: Response) => {
    await ActivityLogController.exportActivityLogs(req, res);
  },
);

export default activityLogRouter;
