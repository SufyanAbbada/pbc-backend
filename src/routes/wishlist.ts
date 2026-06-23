import wishlistController from "../controllers/wishlistController";
import validateToken from "../middlewares/token/validateToken";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validate from "../middlewares/globalErrorHandler";
import validateId from "../middlewares/global/validateId";
import validateTitles from "../middlewares/global/validateTitles";
import validateEnumField from "../middlewares/global/validateStatus";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import parseSortAndFilterParams from "../middlewares/global/parseSortAndFilterParams";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateUserWishlistLimit from "../middlewares/wishlist/validateUserWishlistLimit";
import validateWishlistOwnership from "../middlewares/wishlist/validateWishlistOwnership";
import validateWishlistStatus from "../middlewares/wishlist/validateWishlistStatus";
import validateWishlistExistence from "../middlewares/wishlist/validateWishlistExistence";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateUserExistenceByIdParam from "../middlewares/auth/validateUserExistenceByIdParam";
import { Router, Request, Response } from "express";
import { Action, Subject, WishlistStatus } from "../common/enums";

const wishlistRouter = Router();

wishlistRouter.get(
  "/",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.WISHLIST),
  parsePaginationParams,
  parseSortAndFilterParams(WishlistStatus),
  async (req: Request, res: Response) => {
    await wishlistController.getWishlists(req, res);
  },
);

wishlistRouter.post(
  "/",
  [
    ...validateToken,
    ...validateTitles("title"),
    ...validateTitles("suggestions"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.WISHLIST),
  validateUserVerification("isMembershipVerified"),
  validateUserWishlistLimit,
  async (req: Request, res: Response) => {
    await wishlistController.addWishlist(req, res);
  },
);

wishlistRouter.get(
  "/my",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  parsePaginationParams,
  parseSortAndFilterParams(WishlistStatus),
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.WISHLIST),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await wishlistController.getMyWishlist(req, res);
  },
);

wishlistRouter.get(
  "/user/:userId",
  [
    ...validateToken,
    ...validateId("userId"),
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.WISHLIST),
  parsePaginationParams,
  validateUserExistenceByIdParam,
  async (req: Request, res: Response) => {
    await wishlistController.getUserWishlists(req, res);
  },
);

wishlistRouter.get(
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
    await wishlistController.searchWishlists(req, res);
  },
);

wishlistRouter.get(
  "/:wishlistId",
  [...validateToken, ...validateId("wishlistId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.WISHLIST),
  validateUserVerification("isMembershipVerified"),
  async (req: Request, res: Response) => {
    await wishlistController.getWishlistById(req, res);
  },
);

wishlistRouter.patch(
  "/status/:wishlistId",
  [
    ...validateToken,
    ...validateId("wishlistId"),
    ...validateEnumField("status", WishlistStatus),
    ...validateTitles("comment"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.WISHLIST),
  async (req: Request, res: Response) => {
    await wishlistController.updateWishlistStatus(req, res);
  },
);

wishlistRouter.patch(
  "/:wishlistId",
  [
    ...validateToken,
    ...validateId("wishlistId"),
    ...validateOptional("title"),
    ...validateOptional("suggestions"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.UPDATE, Subject.WISHLIST),
  validateUserVerification("isMembershipVerified"),
  validateWishlistExistence(),
  validateWishlistStatus,
  validateWishlistOwnership,
  async (req: Request, res: Response) => {
    await wishlistController.updateWishlist(req, res);
  },
);

wishlistRouter.delete(
  "/:wishlistId",
  [...validateToken, ...validateId("wishlistId"), validate],
  extractUserFromToken,
  validatePermissions(Action.DELETE, Subject.WISHLIST),
  validateUserVerification("isMembershipVerified"),
  validateWishlistExistence(),
  validateWishlistOwnership,
  async (req: Request, res: Response) => {
    await wishlistController.deleteWishlist(req, res);
  },
);

export default wishlistRouter;
