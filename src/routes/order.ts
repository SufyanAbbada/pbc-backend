import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateUserExistenceByIdParam from "../middlewares/auth/validateUserExistenceByIdParam";
import validateUserExistenceById from "../middlewares/auth/validateUserExistenceById";
import OrderController from "../controllers/orderController";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const orderRouter = Router();

orderRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ORDER),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await OrderController.getAllOrders(req, res);
  },
);

orderRouter.get(
  "/:orderId",
  [...validateToken, ...validateId("orderId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ORDER),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await OrderController.getOrder(req, res);
  },
);

orderRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateId("userId"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ORDER),
  validateUserExistenceByIdParam,
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await OrderController.getUserOrders(req, res);
  },
);

orderRouter.get(
  "/my/orders",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ORDER),
  validateUserExistenceById,
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await OrderController.getMyOrders(req, res);
  },
);

orderRouter.get(
  "/seller/orders",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ORDER),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await OrderController.getSellerOrders(req, res);
  },
);

export default orderRouter;
