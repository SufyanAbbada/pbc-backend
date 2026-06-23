import TransactionCategoryController from "../controllers/transactionCategoryController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateTransactionCategoryUniqueness from "../middlewares/transactionCategory/validateTransactionCategoryUniqueness";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateTransactionCategoryExistence from "../middlewares/transactionCategory/validateTransactionCategoryExistence";
import validateDependingTransactions from "../middlewares/transactionCategory/validateDependingTickets";
import validatePermissions from "../middlewares/global/validatePermissions";
import { Router, Request, Response } from "express";
import { Action, Subject } from "../common/enums";

const transactionCategoryRouter = Router();

transactionCategoryRouter.post(
  "/add",
  [...validateToken, ...validateTitles("name"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.TRANSACTION_CATEGORY),
  validateTransactionCategoryUniqueness,
  async (req: Request, res: Response) => {
    await TransactionCategoryController.addTransactionCategory(req, res);
  },
);

transactionCategoryRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TRANSACTION_CATEGORY),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionCategoryController.getAllTransactionCategories(req, res);
  },
);

transactionCategoryRouter.get(
  "/:categoryId",
  [...validateToken, ...validateId("categoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TRANSACTION_CATEGORY),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionCategoryController.getTransactionCategoryById(req, res);
  },
);

transactionCategoryRouter.put(
  "/:categoryId",
  [
    ...validateToken,
    ...validateId("categoryId"),
    ...validateTitles("name"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.TRANSACTION_CATEGORY),
  validateTransactionCategoryExistence,
  validateTransactionCategoryUniqueness,
  async (req: Request, res: Response) => {
    await TransactionCategoryController.updateTransactionCategory(req, res);
  },
);

transactionCategoryRouter.delete(
  "/:categoryId",
  [...validateToken, ...validateId("categoryId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.TRANSACTION_CATEGORY),
  validateTransactionCategoryExistence,
  validateDependingTransactions,
  async (req: Request, res: Response) => {
    await TransactionCategoryController.deleteTransactionCategory(req, res);
  },
);

export default transactionCategoryRouter;
