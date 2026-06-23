import JobApplicationController from "../controllers/jobApplicationController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateJobPostExistence from "../middlewares/jobPost/validateJobPostExistence";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateFileUpload from "../middlewares/global/validateFileUpload";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateTitles from "../middlewares/global/validateTitles";
import validateOptionalUrl from "../middlewares/global/validateOptionalUrl";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";
import { Action, AssetTypes, SourceType, Subject } from "../common/enums";

const jobApplicationRouter = Router();

jobApplicationRouter.post(
  "/apply",
  configureMulter(["resumeDoc"], AssetTypes.DOCUMENTS),
  fileCleanupMiddleware,
  [
    ...validateTitles("applicantName"),
    ...validateOptionalUrl("linkedInProfile"),
    ...validateId("jobPostId", SourceType.BODY),
    validate,
  ],
  validateFileUpload("resumeDoc"),
  validateJobPostExistence,
  async (req: Request, res: Response) => {
    await JobApplicationController.applyForJob(req, res);
  },
);

jobApplicationRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.JOB_APPLICATION),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobApplicationController.getAllJobApplications(req, res);
  },
);

jobApplicationRouter.get(
  "/:jobApplicationId",
  [...validateToken, ...validateId("jobApplicationId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.JOB_APPLICATION),
  async (req: Request, res: Response) => {
    await JobApplicationController.getJobApplicationById(req, res);
  },
);

export default jobApplicationRouter;
