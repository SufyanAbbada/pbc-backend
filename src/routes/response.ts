import responseController from "../controllers/responseController";
import validateToken from "../middlewares/token/validateToken";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateTicketExistence from "../middlewares/ticket/validateTicketExistence";
import validateTicketStatus from "../middlewares/ticket/validateTicketStatus";
import validateWishlistExistence from "../middlewares/wishlist/validateWishlistExistence";
import validateWishlistStatus from "../middlewares/wishlist/validateWishlistStatus";
import validateTaskExistence from "../middlewares/task/validateTaskExistence";
import validateTaskNotCompleted from "../middlewares/task/validateTaskNotCompleted";
import validateResponseExistence from "../middlewares/response/validateResponseExistence";
import validateResponsePermission from "../middlewares/response/validateResponsePermission";
import validateRfqOpenStatus from "../middlewares/rfq/validateRfqOpenStatus";
import validateExistingQuote from "../middlewares/quote/validateExistingQuote";
import validateInitiativeExistence from "../middlewares/initiative/validateInitiativeExistence";
import validateInitiativeStatus from "../middlewares/initiative/validateInitiativeStatus";
import validateOpenIfRFQ from "../middlewares/response/validateOpenIfRFQ";
import { Router, Request, Response } from "express";
import { Action, SourceType, Subject } from "../common/enums";

const responseRouter = Router();

responseRouter.post(
  "/ticket",
  [
    ...validateToken,
    ...validateId("ticketId", SourceType.BODY),
    ...validateTitles("response"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateTicketExistence(SourceType.BODY),
  validateTicketStatus,
  async (req: Request, res: Response) => {
    await responseController.createResponse(req, res);
  },
);

responseRouter.post(
  "/wishlist",
  [
    ...validateToken,
    ...validateId("wishlistId", SourceType.BODY),
    ...validateTitles("response"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateWishlistExistence(SourceType.BODY),
  validateWishlistStatus,
  async (req: Request, res: Response) => {
    await responseController.createResponse(req, res);
  },
);

responseRouter.post(
  "/task",
  [
    ...validateToken,
    ...validateId("taskId", SourceType.BODY),
    ...validateTitles("response"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateTaskExistence(SourceType.BODY),
  validateTaskNotCompleted,
  async (req: Request, res: Response) => {
    await responseController.createResponse(req, res);
  },
);

responseRouter.post(
  "/quote",
  [
    ...validateToken,
    ...validateId("quoteId", SourceType.BODY),
    ...validateTitles("response"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.QUOTE),
  validateUserVerification("isMembershipVerified"),
  validateExistingQuote(SourceType.BODY),
  validateRfqOpenStatus,
  async (req: Request, res: Response) => {
    await responseController.createResponse(req, res);
  },
);

responseRouter.post(
  "/initiative",
  [
    ...validateToken,
    ...validateId("initiativeId", SourceType.BODY),
    ...validateTitles("response"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateInitiativeExistence(SourceType.BODY),
  validateInitiativeStatus,
  async (req: Request, res: Response) => {
    await responseController.createResponse(req, res);
  },
);

responseRouter.get(
  "/:responseId",
  [...validateToken, ...validateId("responseId"), validate],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await responseController.getResponseById(req, res);
  },
);

responseRouter.get(
  "/ticket/:ticketId",
  [
    ...validateToken,
    ...validateId("ticketId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateTicketExistence(),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await responseController.getResponsesByAssociation(req, res);
  },
);

responseRouter.get(
  "/wishlist/:wishlistId",
  [
    ...validateToken,
    ...validateId("wishlistId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.WISHLIST),
  validateUserVerification("isMembershipVerified"),
  validateWishlistExistence(),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await responseController.getResponsesByAssociation(req, res);
  },
);

responseRouter.get(
  "/task/:taskId",
  [
    ...validateToken,
    ...validateId("taskId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TASK),
  validateUserVerification("isMembershipVerified"),
  validateTaskExistence(),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await responseController.getResponsesByAssociation(req, res);
  },
);

responseRouter.get(
  "/quote/:quoteId",
  [
    ...validateToken,
    ...validateId("quoteId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.QUOTE),
  validateUserVerification("isMembershipVerified"),
  validateExistingQuote(),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await responseController.getResponsesByAssociation(req, res);
  },
);

responseRouter.get(
  "/initiative/:initiativeId",
  [
    ...validateToken,
    ...validateId("initiativeId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  validateInitiativeExistence(),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await responseController.getResponsesByAssociation(req, res);
  },
);

responseRouter.delete(
  "/:responseId",
  [...validateToken, ...validateId("responseId"), validate],
  extractUserFromToken,
  validateResponseExistence(),
  validateResponsePermission,
  validateOpenIfRFQ,
  async (req: Request, res: Response) => {
    await responseController.deleteResponse(req, res);
  },
);

export default responseRouter;
