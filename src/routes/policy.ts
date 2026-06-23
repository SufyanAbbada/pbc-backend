import PolicyController from "../controllers/policyController";
import validateId from "../middlewares/global/validateId";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validateTitles from "../middlewares/global/validateTitles";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePolicyExistence from "../middlewares/policy/validatePolicyExistence";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validatePolicyOwner from "../middlewares/policy/validatePolicyOwner";
import validateOptional from "../middlewares/global/validateOptionalField";
import validatePermissions from "../middlewares/global/validatePermissions";
import validatePolicyDependency from "../middlewares/policy/validatePolicyDependency";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const policyRouter = Router();

policyRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.POLICY),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PolicyController.addPolicy(req, res);
  },
);

policyRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.POLICY),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PolicyController.getAllPolicies(req, res);
  },
);

policyRouter.get(
  "/:policyId",
  [...validateToken, ...validateId("policyId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.POLICY),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PolicyController.getPolicyById(req, res);
  },
);

policyRouter.patch(
  "/:policyId",
  [
    ...validateToken,
    ...validateId("policyId"),
    ...validateOptional("title"),
    ...validateOptional("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.POLICY),
  validatePolicyExistence(),
  validatePolicyOwner,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PolicyController.updatePolicy(req, res);
  },
);

policyRouter.delete(
  "/:policyId",
  [...validateToken, ...validateId("policyId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.POLICY),
  validatePolicyExistence(),
  validatePolicyOwner,
  validatePolicyDependency(),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await PolicyController.deletePolicy(req, res);
  },
);

export default policyRouter;
