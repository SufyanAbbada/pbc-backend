import initiativeController from "../controllers/initiativeController";
import validateToken from "../middlewares/token/validateToken";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateEnumField from "../middlewares/global/validateStatus";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateEnumQueryParam from "../middlewares/global/validateEnumQueryParam";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateInitiativeOwnership from "../middlewares/initiative/validateInitiativeOwnership";
import validateInitiativeStatus from "../middlewares/initiative/validateInitiativeStatus";
import validateInitiativeExistence from "../middlewares/initiative/validateInitiativeExistence";
import validateInitiativeProgression from "../middlewares/initiative/validateInitiativeProgression";
import validateUserExistenceByIdParam from "../middlewares/auth/validateUserExistenceByIdParam";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, InitiativeStatus, Subject } from "../common/enums";

const initiativeRouter = Router();

initiativeRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateEnumQueryParam("status", InitiativeStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await initiativeController.getInitiatives(req, res);
  },
);

initiativeRouter.post(
  "/",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await initiativeController.addInitiative(req, res);
  },
);

initiativeRouter.get(
  "/user/my",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await initiativeController.getMyInitiatives(req, res);
  },
);

initiativeRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateId("userId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  validateUserExistenceByIdParam,
  async (req: Request, res: Response) => {
    await initiativeController.getUserInitiatives(req, res);
  },
);

initiativeRouter.get(
  "/:initiativeId",
  [...validateToken, ...validateId("initiativeId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await initiativeController.getInitiativeById(req, res);
  },
);

initiativeRouter.patch(
  "/status/:initiativeId",
  [
    ...validateToken,
    ...validateId("initiativeId"),
    ...validateEnumField("status", InitiativeStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  validateInitiativeExistence(),
  validateInitiativeProgression,
  validateInitiativeStatus,
  validateInitiativeOwnership,
  async (req: Request, res: Response) => {
    await initiativeController.updateInitiativeStatus(req, res);
  },
);

initiativeRouter.patch(
  "/:initiativeId",
  [
    ...validateToken,
    ...validateId("initiativeId"),
    ...validateTitles("title"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  validateInitiativeExistence(),
  validateInitiativeStatus,
  validateInitiativeOwnership,
  async (req: Request, res: Response) => {
    await initiativeController.updateInitiative(req, res);
  },
);

initiativeRouter.delete(
  "/:initiativeId",
  [...validateToken, ...validateId("initiativeId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.INITIATIVE),
  validateUserVerification("isMembershipVerified"),
  validateInitiativeExistence(),
  validateInitiativeOwnership,
  async (req: Request, res: Response) => {
    await initiativeController.deleteInitiative(req, res);
  },
);

export default initiativeRouter;
