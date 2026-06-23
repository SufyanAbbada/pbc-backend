import ticketCategoryController from "../controllers/ticketCategoryController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateTicketCategoryUniqueness from "../middlewares/ticketCategory/validateTicketCategoryUniqueness";
import validateTicketCategoryExistence from "../middlewares/ticketCategory/validateTicketCategoryExistence";
import validateDependingTickets from "../middlewares/ticketCategory/validateDependingTickets";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const ticketCategoryRouter = Router();

ticketCategoryRouter.post(
  "/",
  [...validateToken, ...validateTitles("name"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.TICKET_CATEGORY),
  validateTicketCategoryUniqueness,
  async (req: Request, res: Response) => {
    await ticketCategoryController.addTicketCategory(req, res);
  },
);

ticketCategoryRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TICKET_CATEGORY),
  validateUserVerification("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await ticketCategoryController.getAllTicketCategories(req, res);
  },
);

ticketCategoryRouter.get(
  "/:ticketCategoryId",
  [...validateToken, ...validateId("ticketCategoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TICKET_CATEGORY),
  validateUserVerification("isMembershipVerified"),
  validateTicketCategoryExistence,
  async (req: Request, res: Response) => {
    await ticketCategoryController.getTicketCategoryById(req, res);
  },
);

ticketCategoryRouter.put(
  "/:ticketCategoryId",
  [
    ...validateToken,
    ...validateId("ticketCategoryId"),
    ...validateTitles("name"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.TICKET_CATEGORY),
  validateTicketCategoryExistence,
  async (req: Request, res: Response) => {
    await ticketCategoryController.updateTicketCategory(req, res);
  },
);

ticketCategoryRouter.delete(
  "/:ticketCategoryId",
  [...validateToken, ...validateId("ticketCategoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.TICKET_CATEGORY),
  validateTicketCategoryExistence,
  validateDependingTickets,
  async (req: Request, res: Response) => {
    await ticketCategoryController.deleteTicketCategory(req, res);
  },
);

export default ticketCategoryRouter;
