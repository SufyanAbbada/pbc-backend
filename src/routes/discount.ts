import discountController from "../controllers/discountController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateIntegerField from "../middlewares/global/validateIntegerField";
import validateDiscountCodeExistence from "../middlewares/discount/validateDiscountCodeExistence";
import validateDiscountExistence from "../middlewares/discount/validateDiscountExistence";
import validateAndParseDiscountValidity from "../middlewares/discount/parseDiscountValidity";
import validateBooleanField from "../middlewares/global/validateBooleanField";
import validateTitles from "../middlewares/global/validateTitles";
import validateDateField from "../middlewares/global/validateDate";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateDiscountOwner from "../middlewares/discount/validateDiscountOwner";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateDiscountCodeAvailability from "../middlewares/discount/validateDiscountCodeAvailability";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateDiscountValue from "../middlewares/discount/validateDiscountValue";
import { Router, Request, Response } from "express";
import { Action, DateType, Subject } from "../common/enums";

const discountRouter = Router();

discountRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.DISCOUNT),
  parsePaginationParams,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.getDiscounts(req, res);
  },
);

discountRouter.get(
  "/:discountId",
  [...validateToken, ...validateId("discountId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.DISCOUNT),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.getDiscountById(req, res);
  },
);

discountRouter.get(
  "/my/discounts",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.DISCOUNT),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.getMyDiscounts(req, res);
  },
);

discountRouter.get(
  "/user/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.DISCOUNT),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.getUserDiscounts(req, res);
  },
);

discountRouter.post(
  "/add",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("discountCode"),
    ...validateIntegerField("value"),
    ...validateBooleanField("isFeatured"),
    ...validateDateField("startDate"),
    ...validateDateField("validUntil"),
    ...validateOptional("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.DISCOUNT),
  validateDiscountValue,
  validateDiscountCodeExistence,
  validateAndParseDate("startDate", DateType.START),
  validateAndParseDate("validUntil", DateType.END),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.addDiscount(req, res);
  },
);

discountRouter.delete(
  "/:discountId",
  [...validateToken, ...validateId("discountId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.DISCOUNT),
  validateDiscountExistence,
  validateDiscountOwner,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.deleteDiscountById(req, res);
  },
);

discountRouter.put(
  "/:discountId",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("discountCode"),
    ...validateIntegerField("value"),
    ...validateDateField("startDate"),
    ...validateDateField("validUntil"),
    ...validateId("discountId"),
    ...validateOptional("description"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.DISCOUNT),
  validateDiscountExistence,
  validateDiscountOwner,
  validateDiscountCodeAvailability,
  validateAndParseDate("startDate", DateType.START),
  validateAndParseDate("validUntil", DateType.END),
  validateDiscountValue,
  validateAndParseDiscountValidity,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.updateDiscountById(req, res);
  },
);

discountRouter.patch(
  "/update-status/:discountId",
  [
    ...validateToken,
    ...validateId("discountId"),
    ...validateBooleanField("isActive"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.DISCOUNT),
  validateDiscountExistence,
  validateDiscountOwner,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.updateDiscountStatus(req, res);
  },
);

discountRouter.patch(
  "/update-featured-status/:discountId",
  [
    ...validateToken,
    ...validateId("discountId"),
    ...validateBooleanField("isFeatured"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.DISCOUNT),
  validateDiscountExistence,
  validateDiscountOwner,
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await discountController.updateDiscountFeaturedStatus(req, res);
  },
);

export default discountRouter;
