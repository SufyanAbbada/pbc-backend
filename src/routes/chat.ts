import chatController from "../controllers/chatController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";
import validateTitles from "../middlewares/global/validateTitles";

const chatRouter = Router();

chatRouter.post(
  "/generate-chat-token",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.CHAT),
  async (req: Request, res: Response) => {
    await chatController.generateTokenForChat(req, res);
  },
);

chatRouter.post(
  "/generate-call-token",
  [...validateToken, ...validateTitles("room"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.CHAT),
  async (req: Request, res: Response) => {
    await chatController.generateTokenForCall(req, res);
  },
);

export default chatRouter;
