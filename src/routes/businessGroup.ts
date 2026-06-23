import BusinessGroupController from "../controllers/businessGroupController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateBusinessGroupUniqueness from "../middlewares/businessGroup/validateBusinessGroupUniqueness";
import validateBusinessGroupExistence from "../middlewares/businessGroup/validateBusinessGroupExistence";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const businessGroupRouter = Router();

businessGroupRouter.post(
  "/",
  [
    ...validateToken,
    ...validateTitles("name"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.BUSINESS_GROUP),
  validateBusinessGroupUniqueness,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await BusinessGroupController.createBusinessGroup(req, res);
  },
);

businessGroupRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.BUSINESS_GROUP),
  parsePaginationParams,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await BusinessGroupController.getAllBusinessGroups(req, res);
  },
);

businessGroupRouter.get(
  "/:businessGroupId",
  [...validateToken, ...validateId("businessGroupId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.BUSINESS_GROUP),
  validateBusinessGroupExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await BusinessGroupController.getBusinessGroupById(req, res);
  },
);

businessGroupRouter.put(
  "/:businessGroupId",
  [
    ...validateToken,
    ...validateId("businessGroupId"),
    ...validateOptional("name"),
    ...validateOptional("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.BUSINESS_GROUP),
  validateBusinessGroupExistence,
  validateBusinessGroupUniqueness,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await BusinessGroupController.updateBusinessGroup(req, res);
  },
);

businessGroupRouter.delete(
  "/:businessGroupId",
  [...validateToken, ...validateId("businessGroupId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.BUSINESS_GROUP),
  validateBusinessGroupExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await BusinessGroupController.deleteBusinessGroup(req, res);
  },
);

export default businessGroupRouter;
