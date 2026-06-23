import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import membershipApprovalController from "../controllers/membershipApprovalController";
import validateId from "../middlewares/global/validateId";
import validateExistingApprovalByUser from "../middlewares/membership/validateExistingApprovalByUser";
import validateChairmanApproval from "../middlewares/membership/validateChairmanApproval";
import validateExistingMembership from "../middlewares/membership/validateExistingMembership";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateEnumField from "../middlewares/global/validateStatus";
import { Router, Request, Response } from "express";
import {
  Action,
  SourceType,
  Subject,
  UpdateGeneralStatus,
} from "../common/enums";

const membershipApprovalRouter = Router();

membershipApprovalRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateId("membershipId", SourceType.BODY),
    ...validateEnumField("status", UpdateGeneralStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.MEMBERSHIP_APPROVAL),
  validateExistingApprovalByUser,
  validateChairmanApproval,
  async (req: Request, res: Response) => {
    membershipApprovalController.createMembershipApproval(req, res);
  },
);

membershipApprovalRouter.get(
  "/:membershipId",
  [...validateToken, ...validateId("membershipId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.MEMBERSHIP_APPROVAL),
  validateExistingMembership,
  async (req: Request, res: Response) => {
    membershipApprovalController.getMembershipApproval(req, res);
  },
);
export default membershipApprovalRouter;
