import ElectionController from "../controllers/electionController";
import validateId from "../middlewares/global/validateId";
import validate from "../middlewares/globalErrorHandler";
import validateToken from "../middlewares/token/validateToken";
import validateTitles from "../middlewares/global/validateTitles";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validatePolicyExistence from "../middlewares/policy/validatePolicyExistence";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateEnumField from "../middlewares/global/validateStatus";
import validateDateField from "../middlewares/global/validateDate";
import validateOptionalId from "../middlewares/global/validateOptionalId";
import validateCandidates from "../middlewares/election/validateCandidates";
import validatePollOptions from "../middlewares/election/validatePollOptions";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import validateElectionTypeConstraints from "../middlewares/election/validateElectionTypeConstraints";
import validateElectionExistence from "../middlewares/election/validateElectionExistence";
import validateVoteConstraints from "../middlewares/election/validateVoteConstraints";
import validateCandidateExistence from "../middlewares/election/validateCandidateExistence";
import validateVoteUniqueness from "../middlewares/election/validateVoteUniqueness";
import validateElectionEndTime from "../middlewares/election/validateElectionEndTime";
import validateElectionTimeValidity from "../middlewares/election/validateElectionTimeValidity";
import validateElectionStartTime from "../middlewares/election/validateElectionStartTime";
import validateMembershipCategoryType from "../middlewares/membership/validateMembershipCategoryType";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validatePaginationQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateOptionalEnumField from "../middlewares/global/validateOptionalStatus";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateIds from "../middlewares/global/validateIds";
import { Router, Request, Response } from "express";
import {
  Action,
  DateType,
  ElectionStatus,
  ElectionType,
  MembershipCategory,
  SourceType,
  Subject,
} from "../common/enums";

const electionRouter = Router();

electionRouter.post(
  "/",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    ...validateEnumField("type", ElectionType),
    ...validateDateField("startDate"),
    ...validateDateField("endDate"),
    ...validateOptionalId("policyId"),
    ...validateIds("candidateIds"),
    ...validatePollOptions,
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.ELECTION),
  validateUserVerification("isMembershipVerified"),
  validateAndParseDate("startDate", DateType.START),
  validateAndParseDate("endDate", DateType.END),
  validateElectionTypeConstraints,
  validateCandidateExistence(),
  validatePolicyExistence(SourceType.BODY, true),
  async (req: Request, res: Response) => {
    await ElectionController.addElection(req, res);
  },
);

electionRouter.get(
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
    await ElectionController.searchElections(req, res);
  },
);

electionRouter.get(
  "/:electionId",
  [...validateToken, ...validateId("electionId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ELECTION),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ElectionController.getElectionById(req, res);
  },
);

electionRouter.get(
  "/",
  [
    ...validateToken,
    ...validatePaginationQueryParams("page"),
    ...validatePaginationQueryParams("limit"),
    ...validateOptionalEnumField("type", ElectionType),
    ...validateOptionalEnumField("status", ElectionStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ELECTION),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ElectionController.getAllElections(req, res);
  },
);

electionRouter.post(
  "/vote",
  [...validateToken, ...validateId("electionId", SourceType.BODY), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.VOTE),
  validateUserVerification("isMembershipVerified"),
  validateMembershipCategoryType(MembershipCategory.CATEGORY_A),
  validateElectionExistence(SourceType.BODY),
  validateVoteConstraints,
  validateElectionTimeValidity,
  validateVoteUniqueness(),
  async (req: Request, res: Response) => {
    await ElectionController.castVote(req, res);
  },
);

electionRouter.get(
  "/results/:electionId",
  [...validateToken, ...validateId("electionId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.ELECTION),
  validateUserVerification("isMembershipVerified"),
  validateElectionExistence(),
  validateElectionEndTime,
  async (req: Request, res: Response) => {
    await ElectionController.getElectionResults(req, res);
  },
);

electionRouter.patch(
  "/:electionId",
  [
    ...validateToken,
    ...validateId("electionId"),
    ...validateTitles("title"),
    ...validateOptional("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.ELECTION),
  validateUserVerification("isMembershipVerified"),
  validateElectionExistence(),
  validateElectionStartTime,
  validateElectionTypeConstraints,
  validatePolicyExistence(SourceType.BODY, true),
  async (req: Request, res: Response) => {
    await ElectionController.updateElection(req, res);
  },
);

export default electionRouter;
