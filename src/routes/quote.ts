import QuoteController from "../controllers/quoteController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateIntegerField from "../middlewares/global/validateIntegerField";
import validateDateField from "../middlewares/global/validateDate";
import validateandParseDate from "../middlewares/global/validateAndParseDate";
import validateId from "../middlewares/global/validateId";
import validateRfqNotSelfQuoted from "../middlewares/quote/validateRfqNotSelfQuoted";
import validateExistingRfq from "../middlewares/rfq/validateExistenceRfqById";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateRfqPictures from "../middlewares/global/validateRfqAndQuotePicture";
import validateSingleQuotePerUser from "../middlewares/quote/validateSingleQuotePerUser";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateTitles from "../middlewares/global/validateTitles";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateQuoteOwnership from "../middlewares/quote/validateQuoteOwnership";
import validatePrice from "../middlewares/product/validatePrice";
import { configureMulter } from "../services/multerService";
import { Router, Request, Response } from "express";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";
import { Action, DateType, SourceType, Subject } from "../common/enums";

const quoteRouter = Router();

quoteRouter.post(
  "/add",
  configureMulter(["primaryImage", "secondaryImage"]),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateId("rfqId", SourceType.BODY),
    ...validateTitles("description"),
    ...validateIntegerField("price"),
    ...validateDateField("timeline"),
    ...validateOptional("termsAndConditions"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.QUOTE),
  validateandParseDate("timeline", DateType.FUTURE),
  validateExistingRfq(SourceType.BODY),
  validateRfqPictures,
  validateRfqNotSelfQuoted,
  validateSingleQuotePerUser,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await QuoteController.addQuote(req, res);
  },
);

quoteRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.QUOTE),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await QuoteController.getAllQuotes(req, res);
  },
);

quoteRouter.get(
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
    await QuoteController.searchQuotes(req, res);
  },
);

quoteRouter.get(
  "/:quoteId",
  [...validateToken, ...validateId("quoteId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.QUOTE),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await QuoteController.getQuoteById(req, res);
  },
);

quoteRouter.patch(
  "/:quoteId",
  [
    ...validateToken,
    ...validateId("quoteId"),
    ...validateOptional("description"),
    ...validateOptional("termsAndConditions"),
    ...validatePrice,
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.QUOTE),
  validateUserVerification("isMembershipVerified"),
  validateQuoteOwnership,
  async (req: Request, res: Response) => {
    await QuoteController.updateQuote(req, res);
  },
);

export default quoteRouter;
