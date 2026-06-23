import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import leadController from "../controllers/leadController";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import validatePaginationQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateProductExistence from "../middlewares/product/validateProductExistence";
import validateProductOwnership from "../middlewares/product/validateProductOwnership";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const leadRouter = Router();

leadRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryField("page"),
    ...validateQueryField("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.LEAD),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await leadController.getAllLead(req, res);
  },
);

leadRouter.get(
  "/my/leads",
  [
    ...validateToken,
    ...validateQueryField("page"),
    ...validateQueryField("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.LEAD),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await leadController.getMyLeads(req, res);
  },
);

leadRouter.get(
  "/my/products/:productId",
  [
    ...validateToken,
    ...validateQueryField("page"),
    ...validateQueryField("limit"),
    ...validateId("productId"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.LEAD),
  validateProductExistence(),
  validateProductOwnership(),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await leadController.getMyProductsLeads(req, res);
  },
);

leadRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateQueryField("page"),
    ...validateQueryField("limit"),
    ...validateId("userId"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.LEAD),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await leadController.getUserLead(req, res);
  },
);

leadRouter.get(
  "/search",
  [
    ...validateToken,
    ...validateQueryField("search"),
    ...validatePaginationQueryParams("page"),
    ...validatePaginationQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await leadController.searchLeads(req, res);
  },
);

export default leadRouter;
