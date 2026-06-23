import constitutionController from "../controllers/constitutionController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateAndParseVersion from "../middlewares/constitution/validateAndParseVersion";
import validateVersionChangeType from "../middlewares/constitution/validateVersionChangeType";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateArticleExistence from "../middlewares/constitution/validateArticleExistence";
import validateConstitutionEditability from "../middlewares/constitution/validateConstitutionEditability";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateEnumField from "../middlewares/global/validateStatus";
import validateDateField from "../middlewares/global/validateDate";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import { Router, Request, Response } from "express";
import { Action, Subject, PolicyVersion, DateType } from "../common/enums";

const constitutionRouter = Router();

constitutionRouter.get(
  "/",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.CONSTITUTION),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await constitutionController.getConstitution(req, res);
  },
);

constitutionRouter.post(
  "/amendment/:articleId",
  [
    ...validateToken,
    ...validateId("articleId"),
    ...validateTitles("content"),
    ...validateEnumField("version", PolicyVersion),
    ...validateVersionChangeType,
    ...validateDateField("startDate"),
    ...validateDateField("endDate"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.CONSTITUTION),
  validateAndParseVersion,
  validateAndParseDate("startDate", DateType.START),
  validateAndParseDate("endDate", DateType.END),
  validateArticleExistence(),
  validateConstitutionEditability,
  async (req: Request, res: Response) => {
    await constitutionController.amendConstitution(req, res);
  },
);

export default constitutionRouter;
