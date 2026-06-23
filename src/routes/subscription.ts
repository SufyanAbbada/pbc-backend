import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import subscriptionController from "../controllers/subscriptionController";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import { Router, Request, Response } from "express";
import { validateSubscriptionId } from "../middlewares/global/validateSubscriptionId";

const subscriptionRouter = Router();

subscriptionRouter.get(
  "/:subscriptionId",
  [...validateToken, ...validateSubscriptionId, validate],
  async (req: Request, res: Response) => {
    subscriptionController.getSubscriptionBySubscriptionId(req, res);
  },
);

subscriptionRouter.get(
  "/my/subscriptions",
  extractUserFromToken,
  [...validateToken, validate],
  async (req: Request, res: Response) => {
    subscriptionController.getMySubscription(req, res);
  },
);
export default subscriptionRouter;
