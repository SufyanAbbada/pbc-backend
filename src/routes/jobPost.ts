import JobPostController from "../controllers/jobPostController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateDateField from "../middlewares/global/validateDate";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateJobCategoryExistence from "../middlewares/jobCategory/validateJobCategoryExistence";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateJobPostExistence from "../middlewares/jobPost/validateJobPostExistence";
import validateOptionalId from "../middlewares/global/validateOptionalId";
import validateOptionalDate from "../middlewares/global/validateOptionalDate";
import validateJobApplicationExistence from "../middlewares/jobApplication/validateJobApplicationExistence";
import validateJobPostOpen from "../middlewares/jobPost/validateJobPostOpen";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import validateJobPostToUserRelation from "../middlewares/jobPost/validateJobPostToUserRelation";
import validateJobAppToJobPostRelation from "../middlewares/jobPost/validateJobAppToJobPostRelation";
import validateJobApplicationPending from "../middlewares/jobPost/validateJobApplicationPending";
import validateAndParseSortParam from "../middlewares/jobPost/validateAndParseSortParam";
import validateAndParseFilterParam from "../middlewares/jobPost/validateAndParseFilterParam";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateOptionalNumericField from "../middlewares/global/validateOptionalNumericField";
import validateEnumField from "../middlewares/global/validateStatus";
import validateArrayField from "../middlewares/global/validateArray";
import validateIsIntMinLessThanMax from "../middlewares/global/validateIsIntMinLessThanMax";
import validateOptionalEnumField from "../middlewares/global/validateOptionalStatus";
import validateLinkedInSocial from "../middlewares/profile/validateLinkedInSocial";
import validateTwitterLink from "../middlewares/profile/validateTwitterLink";
import {
  Action,
  DateType,
  JobMode,
  JobType,
  SourceType,
  Subject,
} from "../common/enums";
import { Router, Request, Response } from "express";

const jobPostRouter = Router();

jobPostRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    ...validateDateField("deadline"),
    ...validateId("jobCategoryId", SourceType.BODY),
    ...validateOptionalNumericField("minExperience"),
    ...validateOptionalNumericField("maxExperience"),
    ...validateOptionalNumericField("minSalary"),
    ...validateOptionalNumericField("maxSalary"),
    ...validateEnumField("jobType", JobType),
    ...validateEnumField("jobMode", JobMode),
    ...validateTitles("location"),
    ...validateLinkedInSocial("linkedInProfile"),
    ...validateTwitterLink("twitterProfile"),
    ...validateArrayField("skills", "int"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.JOB_POST),
  validateAndParseDate("deadline"),
  validateJobCategoryExistence,
  validateIsIntMinLessThanMax("minExperience", "maxExperience"),
  validateIsIntMinLessThanMax("minSalary", "maxSalary"),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobPostController.addJobPost(req, res);
  },
);

jobPostRouter.get(
  "/",
  [...validateQueryParams("page"), ...validateQueryParams("limit"), validate],
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await JobPostController.getAllJobPosts(req, res);
  },
);

jobPostRouter.get(
  "/my-jobPosts",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.JOB_POST),
  parsePaginationParams,
  validateAndParseSortParam,
  validateAndParseFilterParam,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobPostController.getJobPostsByUserId(req, res);
  },
);

jobPostRouter.get(
  "/search",
  [
    ...validateToken,
    ...validateQueryField("search"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await JobPostController.searchJobPosts(req, res);
  },
);

jobPostRouter.get(
  "/:jobPostId",
  [...validateToken, ...validateId("jobPostId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.JOB_POST),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobPostController.getJobPostById(req, res);
  },
);

jobPostRouter.get(
  "/public/:jobPostId",
  [...validateId("jobPostId"), validate],
  async (req: Request, res: Response) => {
    await JobPostController.getPublicJobPostById(req, res);
  },
);

jobPostRouter.patch(
  "/:jobPostId",
  [
    ...validateToken,
    ...validateId("jobPostId"),
    ...validateOptional("title"),
    ...validateOptional("description"),
    ...validateOptionalDate("deadline"),
    ...validateOptionalNumericField("minExperience"),
    ...validateOptionalNumericField("maxExperience"),
    ...validateOptionalNumericField("minSalary"),
    ...validateOptionalNumericField("maxSalary"),
    ...validateOptionalEnumField("jobMode", JobMode),
    ...validateOptionalEnumField("jobType", JobType),
    ...validateOptional("location"),
    ...validateOptionalId("jobCategoryId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.JOB_POST),
  validateAndParseDate("deadline", DateType.FUTURE),
  validateJobPostExistence,
  validateIsIntMinLessThanMax("minExperience", "maxExperience"),
  validateIsIntMinLessThanMax("minSalary", "maxSalary"),
  validateJobCategoryExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobPostController.updateJobPost(req, res);
  },
);

jobPostRouter.patch(
  "/accept-application/:jobPostId",
  [
    ...validateToken,
    ...validateId("jobPostId"),
    ...validateId("jobApplicationId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.JOB_POST),
  validateJobPostExistence,
  validateJobApplicationExistence,
  validateJobPostToUserRelation,
  validateJobAppToJobPostRelation,
  validateJobPostOpen,
  validateJobApplicationPending,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobPostController.acceptJobApplication(req, res);
  },
);

jobPostRouter.patch(
  "/reject-application/:jobPostId",
  [
    ...validateToken,
    ...validateId("jobPostId"),
    ...validateId("jobApplicationId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.JOB_POST),
  validateJobPostExistence,
  validateJobApplicationExistence,
  validateJobPostToUserRelation,
  validateJobAppToJobPostRelation,
  validateJobPostOpen,
  validateJobApplicationPending,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await JobPostController.rejectJobApplication(req, res);
  },
);

export default jobPostRouter;
