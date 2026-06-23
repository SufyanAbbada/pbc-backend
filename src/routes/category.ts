import CategoryController from "../controllers/categoryController";
import validateId from "../middlewares/global/validateId";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validateCategoryUniqueness from "../middlewares/category/validateCategoryUniqueness";
import validateCategoryExistence from "../middlewares/category/validateCategoryExistence";
import validateCategoryAvailability from "../middlewares/category/validateCategoryAvailibility";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateTitles from "../middlewares/global/validateTitles";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateCategoryDependency from "../middlewares/category/validateCategoryDependency";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const categoryRouter = Router();

categoryRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateTitles("name"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.CATEGORY),
  validateCategoryUniqueness,
  async (req: Request, res: Response) => {
    await CategoryController.addCategory(req, res);
  },
);

categoryRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.CATEGORY),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CategoryController.getAllCategories(req, res);
  },
);

categoryRouter.get(
  "/:categoryId",
  [...validateToken, ...validateId("categoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.CATEGORY),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await CategoryController.getCategoryById(req, res);
  },
);

categoryRouter.put(
  "/:categoryId",
  [
    ...validateToken,
    ...validateId("categoryId"),
    ...validateTitles("name"),
    ...validateTitles("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.CATEGORY),
  validateCategoryExistence(),
  validateCategoryAvailability,
  async (req: Request, res: Response) => {
    await CategoryController.updateCategory(req, res);
  },
);

categoryRouter.delete(
  "/:categoryId",
  [...validateToken, ...validateId("categoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.CATEGORY),
  validateCategoryExistence(),
  validateCategoryDependency(),
  async (req: Request, res: Response) => {
    await CategoryController.deleteCategory(req, res);
  },
);

export default categoryRouter;
