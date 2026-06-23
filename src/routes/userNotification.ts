import UserNotificationController from "../controllers/userNotificationController";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validatePaginationQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import { Router, Request, Response } from "express";

const userNotificationRouter = Router();

userNotificationRouter.get(
  "/",
  [
    ...validateToken,
    ...validatePaginationQueryParams("page"),
    ...validatePaginationQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await UserNotificationController.getAllNotifications(req, res);
  },
);

userNotificationRouter.get(
  "/unread",
  [...validateToken, validate],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await UserNotificationController.getUnreadNotifications(req, res);
  },
);

export default userNotificationRouter;
