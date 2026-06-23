import TransactionController from "../controllers/transactionController";
import validateToken from "../middlewares/token/validateToken";
import validateId from "../middlewares/global/validateId";
import validateOptionalId from "../middlewares/global/validateOptionalId";
import validateTitles from "../middlewares/global/validateTitles";
import validateNumericField from "../middlewares/global/validateNumericField";
import validate from "../middlewares/globalErrorHandler";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateTransactionCategoryExistence from "../middlewares/transactionCategory/validateTransactionCategoryExistence";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import parseSortAndFilterParams from "../middlewares/global/parseSortAndFilterParams";
import validateTransactionExistence from "../middlewares/transaction/validateTransactionExistence";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateTransactionDocs from "../middlewares/transaction/validateTransactionDocs";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateOptionalNumericField from "../middlewares/global/validateOptionalNumericField";
import validateOptionalFileUpload from "../middlewares/global/validateOptionalFileUpload";
import validateEnumField from "../middlewares/global/validateStatus";
import validateOptionalEnumField from "../middlewares/global/validateOptionalStatus";
import validateFileUpload from "../middlewares/global/validateFileUpload";
import validateOptionalDate from "../middlewares/global/validateOptionalDate";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateTransactionOwnership from "../middlewares/transaction/validateTransactionOwnership";
import validateTransactionPending from "../middlewares/transaction/validateTransactionPending";
import { Router, Request, Response } from "express";
import {
  AssetTypes,
  SourceType,
  GeneralStatus,
  Action,
  Subject,
  UpdateGeneralStatus,
} from "../common/enums";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";

const transactionRouter = Router();

transactionRouter.post(
  "/add",
  configureMulter(["primaryImage", "secondaryImage"], AssetTypes.IMAGES),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateOptional("notes"),
    ...validateNumericField("amount"),
    ...validateId("categoryId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.TRANSACTION),
  validateFileUpload("primaryImage"),
  validateOptionalFileUpload("secondaryImage"),
  validateTransactionCategoryExistence,
  validateTransactionDocs,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.addTransaction(req, res);
  },
);

transactionRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TRANSACTION),
  parsePaginationParams,
  parseSortAndFilterParams(GeneralStatus),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.getTransactions(req, res);
  },
);

transactionRouter.get(
  "/:transactionId",
  [...validateToken, ...validateId("transactionId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TRANSACTION),
  validateTransactionExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.getTransactionById(req, res);
  },
);

transactionRouter.patch(
  "/:transactionId",
  configureMulter(["primaryImage", "secondaryImage"], AssetTypes.IMAGES),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateId("transactionId", SourceType.PARAM),
    ...validateOptionalId("categoryId", SourceType.BODY),
    ...validateOptional("title"),
    ...validateOptional("notes"),
    ...validateOptionalNumericField("amount"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.TRANSACTION),
  validateTransactionExistence,
  validateTransactionPending,
  validateTransactionCategoryExistence,
  validateOptionalFileUpload("primaryImage"),
  validateOptionalFileUpload("secondaryImage"),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.updateTransaction(req, res);
  },
);

transactionRouter.patch(
  "/update-status/:transactionId",
  [
    ...validateToken,
    ...validateId("transactionId"),
    ...validateEnumField("status", UpdateGeneralStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.TRANSACTION),
  validateTransactionExistence,
  validateTransactionOwnership,
  validateTransactionPending,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.updateTransactionStatus(req, res);
  },
);

transactionRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateId("userId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TRANSACTION),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.getTransactionByUserId(req, res);
  },
);

transactionRouter.post(
  "/filter",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateOptional("title"),
    ...validateOptionalNumericField("amount"),
    ...validateOptionalEnumField("status", GeneralStatus),
    ...validateOptionalId("categoryId", SourceType.BODY),
    ...validateOptionalDate("createdAt"),
    ...validateOptionalDate("updatedAt"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.TRANSACTION),
  parsePaginationParams,
  validateTransactionCategoryExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.filterTransactions(req, res);
  },
);

transactionRouter.delete(
  "/:transactionId",
  [...validateToken, ...validateId("transactionId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.TRANSACTION),
  validateTransactionExistence,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await TransactionController.deleteTransactionbyId(req, res);
  },
);

export default transactionRouter;
