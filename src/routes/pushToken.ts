import PushTokenController from "../controllers/pushTokenController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateId from "../middlewares/global/validateId";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateTitles from "../middlewares/global/validateTitles";
import validateTokenExistence from "../middlewares/pushToken/validateTokenExistence";
import validateTokenOwnership from "../middlewares/pushToken/validateTokenOwnership";
import validateUsersExistenceByEmails from "../middlewares/pushToken/validateUsersExistenceByEmails";
import validateDuplicateTokens from "../middlewares/pushToken/validateDuplicateTokens";
import validateArrayField from "../middlewares/global/validateArray";
import validateEnumField from "../middlewares/global/validateStatus";
import { Router, Request, Response } from "express";
import { CallNotificationType, CallType, SourceType } from "../common/enums";

const pushTokenRouter = Router();

pushTokenRouter.post(
  "/",
  [...validateToken, ...validateTitles("token"), validate],
  extractUserFromToken,
  validateDuplicateTokens,
  async (req: Request, res: Response) => {
    await PushTokenController.registerToken(req, res);
  },
);

pushTokenRouter.post(
  "/call-notification",
  [
    ...validateToken,
    ...validateArrayField("emails"),
    ...validateTitles("callFrom"),
    ...validateEnumField("callType", CallType),
    ...validateTitles("roomName"),
    ...validateEnumField("type", CallNotificationType),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateUsersExistenceByEmails,
  async (req: Request, res: Response) => {
    await PushTokenController.sendCallNotification(req, res);
  },
);

pushTokenRouter.get(
  "/user/my",
  [...validateToken, validate],
  extractUserFromToken,
  async (req: Request, res: Response) => {
    await PushTokenController.getUserTokens(req, res);
  },
);

pushTokenRouter.get(
  "/user/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PushTokenController.getUserTokens(req, res);
  },
);

pushTokenRouter.get(
  "/",
  [...validateToken, validate],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PushTokenController.getAllTokens(req, res);
  },
);

pushTokenRouter.delete(
  "/:token",
  [...validateToken, ...validateTitles("token", SourceType.PARAM), validate],
  extractUserFromToken,
  validateTokenExistence(),
  async (req: Request, res: Response) => {
    await PushTokenController.deleteToken(req, res);
  },
);

pushTokenRouter.delete(
  "/my/token",
  [...validateToken, validate],
  extractUserFromToken,
  async (req: Request, res: Response) => {
    await PushTokenController.deleteAllUserTokens(req, res);
  },
);

export default pushTokenRouter;
