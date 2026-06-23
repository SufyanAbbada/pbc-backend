import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import MembershipController from "../controllers/membershipController";
import validateEnumField from "../middlewares/global/validateStatus";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateExistingMembership from "../middlewares/membership/validateExistingMembership";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Action, GeneralStatus, Subject } from "../common/enums";
import { Router, Request, Response } from "express";

const membershipRouter = Router();

membershipRouter.get(
  "/my/membership",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.MEMBERSHIP),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await MembershipController.getMyMembership(req, res);
  },
);

membershipRouter.get(
  "/:membershipId",
  [...validateId("membershipId"), ...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.MEMBERSHIP),
  async (req: Request, res: Response) => {
    await MembershipController.getMembershipById(req, res);
  },
);

membershipRouter.get(
  "/user/:userId",
  [...validateId("userId"), ...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.MEMBERSHIP),
  async (req: Request, res: Response) => {
    await MembershipController.getUserMembership(req, res);
  },
);

membershipRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.MEMBERSHIP),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await MembershipController.getAllMembership(req, res);
  },
);

membershipRouter.patch(
  "/update-status/:membershipId",
  [
    ...validateToken,
    ...validateId("membershipId"),
    ...validateEnumField("status", GeneralStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.MEMBERSHIP),
  validateExistingMembership,
  async (req: Request, res: Response) => {
    await MembershipController.updateMembershipStatus(req, res);
  },
);

export default membershipRouter;
