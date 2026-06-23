import RfqController from "../controllers/rfqController";
import QuoteController from "../controllers/quoteController";
import validateToken from "../middlewares/token/validateToken";
import validateTitles from "../middlewares/global/validateTitles";
import validate from "../middlewares/globalErrorHandler";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateIntegerField from "../middlewares/global/validateIntegerField";
import validateDateField from "../middlewares/global/validateDate";
import validateId from "../middlewares/global/validateId";
import validateExistingRfq from "../middlewares/rfq/validateExistenceRfqById";
import validateRfqOwner from "../middlewares/rfq/validateRfqOwner";
import validateExistingQuote from "../middlewares/quote/validateExistingQuote";
import validateEnumField from "../middlewares/global/validateStatus";
import validateQuoteAssociation from "../middlewares/quote/validateQuoteAssociation";
import validateProductExistence from "../middlewares/product/validateProductExistence";
import validateNotProductOwner from "../middlewares/product/validateNotProductOwner";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import validateRfqPictures from "../middlewares/global/validateRfqAndQuotePicture";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateCategoryExistenceByName from "../middlewares/category/validateCategoryExistenceByName";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateRfqAlreadyAwarded from "../middlewares/rfq/validateRfqAlreadyAwarded";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateRfqDependency from "../middlewares/rfq/validateRfqDependency";
import validateOptionalId from "../middlewares/global/validateOptionalId";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateOptionalDate from "../middlewares/global/validateOptionalDate";
import {
  Action,
  DateType,
  RfqStatus,
  SourceType,
  Subject,
} from "../common/enums";
import { Router, Request, Response } from "express";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";

const rfqRouter = Router();

rfqRouter.post(
  "/add",
  configureMulter(["primaryImage", "secondaryImage"]),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("description"),
    ...validateIntegerField("quantity"),
    ...validateIntegerField("budget"),
    ...validateDateField("deadline"),
    ...validateTitles("categoryName"),
    ...validateOptionalId("productId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.RFQ),
  validateAndParseDate("deadline", DateType.FUTURE),
  validateRfqPictures,
  validateCategoryExistenceByName("categoryName"),
  validateProductExistence(SourceType.BODY),
  validateNotProductOwner(),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.addRfq(req, res);
  },
);

rfqRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.RFQ),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.getAllRfq(req, res);
  },
);

rfqRouter.get(
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
    await RfqController.searchRfqs(req, res);
  },
);

rfqRouter.get(
  "/:rfqId",
  [...validateToken, ...validateId("rfqId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.RFQ),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.getRfqById(req, res);
  },
);

rfqRouter.get(
  "/quote/:rfqId",
  [
    ...validateToken,
    ...validateId("rfqId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.QUOTE),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await QuoteController.getQuoteByRfqId(req, res);
  },
);

rfqRouter.get(
  "/my/awarded-quote",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.RFQ),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.getMyAwardedRfq(req, res);
  },
);

rfqRouter.get(
  "/my/rfqs",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.RFQ),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.getMyRfq(req, res);
  },
);

rfqRouter.put(
  "/:rfqId",
  configureMulter(["primaryImage", "secondaryImage"]),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateOptionalId("rfqId"),
    ...validateOptional("title"),
    ...validateOptional("description"),
    ...validateIntegerField("quantity", 1, true),
    ...validateIntegerField("budget", 1, true),
    ...validateOptionalDate("deadline"),
    ...validateOptional("categoryName"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.RFQ),
  validateExistingRfq(),
  validateAndParseDate("deadline", DateType.FUTURE),
  validateRfqOwner,
  validateRfqPictures,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.updateRfqbyId(req, res);
  },
);

rfqRouter.delete(
  "/:rfqId",
  [...validateToken, ...validateId("rfqId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.RFQ),
  validateExistingRfq(),
  validateRfqOwner,
  validateRfqDependency(),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.deleteRfq(req, res);
  },
);

rfqRouter.patch(
  "/award/:rfqId",
  [
    ...validateToken,
    ...validateId("rfqId"),
    ...validateId("quoteId", SourceType.BODY),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.RFQ),
  validateExistingRfq(),
  validateExistingQuote(SourceType.BODY),
  validateQuoteAssociation,
  validateRfqOwner,
  validateRfqAlreadyAwarded,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.addAwardedQuote(req, res);
  },
);

rfqRouter.patch(
  "/update-status/:rfqId",
  [
    ...validateToken,
    ...validateId("rfqId"),
    ...validateEnumField("status", RfqStatus),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.RFQ),
  validateExistingRfq(),
  validateRfqOwner,
  validateRfqAlreadyAwarded,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await RfqController.updateRfqStatus(req, res);
  },
);

export default rfqRouter;
