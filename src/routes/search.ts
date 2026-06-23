import searchController from "../controllers/searchController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const searchRouter = Router();

searchRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryField("search"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.SEARCH),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await searchController.searchAll(req, res);
  },
);

export default searchRouter;
