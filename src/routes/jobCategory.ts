import JobCategoryController from "../controllers/jobCategoryController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateJobCategoryUniqueness from "../middlewares/jobCategory/validateJobCategoryUniqueness";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateJobCategoryExistence from "../middlewares/jobCategory/validateJobCategoryExistence";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateJobCategoryDependency from "../middlewares/jobCategory/validateJobPostDependency";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const jobCategoryRouter = Router();

jobCategoryRouter.post(
  "/add",
  [...validateToken, ...validateTitles("name"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.JOB_CATEGORY),
  validateJobCategoryUniqueness,
  async (req: Request, res: Response) => {
    await JobCategoryController.addJobCategory(req, res);
  },
);

jobCategoryRouter.get(
  "/",
  [...validateQueryParams("page"), ...validateQueryParams("limit"), validate],
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await JobCategoryController.getAllJobCategories(req, res);
  },
);

jobCategoryRouter.get(
  "/:jobCategoryId",
  [...validateToken, ...validateId("jobCategoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.JOB_CATEGORY),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobCategoryController.getJobCategoryById(req, res);
  },
);

jobCategoryRouter.put(
  "/:jobCategoryId",
  [
    ...validateToken,
    ...validateId("jobCategoryId"),
    ...validateTitles("name"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.JOB_CATEGORY),
  validateJobCategoryExistence,
  validateJobCategoryUniqueness,
  async (req: Request, res: Response) => {
    await JobCategoryController.updateJobCategory(req, res);
  },
);

jobCategoryRouter.delete(
  "/:jobCategoryId",
  [...validateToken, ...validateId("jobCategoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.JOB_CATEGORY),
  validateJobCategoryExistence,
  validateJobCategoryDependency(),
  async (req: Request, res: Response) => {
    await JobCategoryController.deleteJobCategory(req, res);
  },
);

export default jobCategoryRouter;
