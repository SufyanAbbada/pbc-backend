import ticketController from "../controllers/ticketController";
import validateToken from "../middlewares/token/validateToken";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateEnumField from "../middlewares/global/validateStatus";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateTicketExistence from "../middlewares/ticket/validateTicketExistence";
import validateTicketOwnership from "../middlewares/ticket/validateTicketOwnership";
import validateTicketStatus from "../middlewares/ticket/validateTicketStatus";
import validateTicketImages from "../middlewares/ticket/validateTicketImages";
import validateOptionalEnumField from "../middlewares/global/validateOptionalStatus";
import validateEnumQueryParam from "../middlewares/global/validateEnumQueryParam";
import validatePermissions from "../middlewares/global/validatePermissions";
import mutateApproveAction from "../middlewares/mutateApproveAction";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateDependingTicketResponses from "../middlewares/ticket/validateTicketDependency";
import validateNextTicketStatus from "../middlewares/ticket/validateNextTicketStatus";
import { Router, Request, Response } from "express";
import {
  TicketStatus,
  TicketPriority,
  SourceType,
  Action,
  Subject,
} from "../common/enums";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";

const ticketRouter = Router();

ticketRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateEnumQueryParam("status", TicketStatus),
    ...validateEnumQueryParam("priority", TicketPriority),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TICKET),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ticketController.getAllTickets(req, res);
  },
);

ticketRouter.post(
  "/",
  configureMulter(["primaryImage", "secondaryImage", "tertiaryImage"]),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    ...validateEnumField("priority", TicketPriority),
    ...validateId("ticketCategoryId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.TICKET),
  validateUserVerification("isMembershipVerified"),
  validateTicketImages,
  async (req: Request, res: Response) => {
    await ticketController.createTicket(req, res);
  },
);

ticketRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateId("userId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TICKET),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ticketController.getUserTickets(req, res);
  },
);

ticketRouter.get(
  "/my",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TICKET),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await ticketController.getUserTickets(req, res);
  },
);

ticketRouter.get(
  "/search",
  [
    ...validateToken,
    ...validateQueryField("search"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ticketController.searchTickets(req, res);
  },
);

ticketRouter.get(
  "/:ticketId",
  [...validateToken, ...validateId("ticketId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TICKET),
  validateUserVerification("isMembershipVerified"),
  validateTicketExistence(),
  async (req: Request, res: Response) => {
    await ticketController.getTicketById(req, res);
  },
);

ticketRouter.patch(
  "/status/:ticketId",
  [
    ...validateToken,
    ...validateId("ticketId"),
    ...validateEnumField("status", TicketStatus),
    validate,
  ],
  extractUserFromToken,
  mutateApproveAction,
  validatePermissions(Action.UPDATE, Subject.TICKET),
  validateTicketExistence(),
  validateNextTicketStatus,
  async (req: Request, res: Response) => {
    await ticketController.updateTicketStatus(req, res);
  },
);

ticketRouter.patch(
  "/:ticketId",
  [
    ...validateToken,
    ...validateId("ticketId"),
    ...validateOptional("title"),
    ...validateOptional("description"),
    ...validateOptionalEnumField("priority", TicketPriority),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.TICKET),
  validateTicketExistence(),
  validateTicketOwnership,
  validateTicketStatus,
  async (req: Request, res: Response) => {
    await ticketController.updateTicket(req, res);
  },
);

ticketRouter.delete(
  "/:ticketId",
  [...validateToken, ...validateId("ticketId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.TICKET),
  validateTicketExistence(),
  validateTicketOwnership,
  validateDependingTicketResponses,
  async (req: Request, res: Response) => {
    await ticketController.deleteTicket(req, res);
  },
);

export default ticketRouter;
