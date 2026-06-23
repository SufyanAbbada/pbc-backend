import JobSkillController from "../controllers/jobSkillController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateJobSkillUniqueness from "../middlewares/jobSkill/validateJobSkillUniqueness";
import validateJobSkillExistence from "../middlewares/jobSkill/validateJobSkillExistence";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Action, Subject } from "../common/enums";
import { Router, Request, Response } from "express";

const jobSkillRouter = Router();

jobSkillRouter.post(
  "/add",
  [...validateToken, ...validateTitles("name"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.JOB_SKILL),
  validateJobSkillUniqueness,
  async (req: Request, res: Response) => {
    await JobSkillController.addJobSkill(req, res);
  },
);

jobSkillRouter.get(
  "/",
  [...validateQueryParams("page"), ...validateQueryParams("limit"), validate],
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await JobSkillController.getAllJobSkills(req, res);
  },
);

jobSkillRouter.get(
  "/:jobSkillId",
  [...validateToken, ...validateId("jobSkillId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.JOB_SKILL),
  async (req: Request, res: Response) => {
    await JobSkillController.getJobSkillById(req, res);
  },
);

jobSkillRouter.put(
  "/:jobSkillId",
  [
    ...validateToken,
    ...validateId("jobSkillId"),
    ...validateTitles("name"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.JOB_SKILL),
  validateJobSkillExistence,
  validateJobSkillUniqueness,
  async (req: Request, res: Response) => {
    await JobSkillController.updateJobSkill(req, res);
  },
);

export default jobSkillRouter;
