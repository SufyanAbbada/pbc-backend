import ProfileController from "../controllers/profileController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateFBSocial from "../middlewares/profile/validateFBSocial";
import validateLinkedInSocial from "../middlewares/profile/validateLinkedInSocial";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import validateCoordinate from "../middlewares/global/validateCoordinates";
import validateExistingProfile from "../middlewares/profile/validateExistingProfile";
import validateNonExistingProfile from "../middlewares/profile/validateNonExistingProfile";
import validateFileUpload from "../middlewares/global/validateFileUpload";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateTitles from "../middlewares/global/validateTitles";
import validateOptionalFileUpload from "../middlewares/global/validateOptionalFileUpload";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateId from "../middlewares/global/validateId";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateCalendlyLink from "../middlewares/profile/validateCalendlyLink";
import { Router, Request, Response } from "express";
import { configureMulter } from "../services/multerService";
import { fileCleanupMiddleware } from "../middlewares/fileCleanupMiddleware";
import { Action, AssetTypes, Subject } from "../common/enums";

const profileRouter = Router();

profileRouter.get(
  "/",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PROFILE),
  validateExistingProfile,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await ProfileController.getMyProfile(req, res);
  },
);

profileRouter.get(
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
    await ProfileController.searchProfiles(req, res);
  },
);

profileRouter.get(
  "/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.PROFILE),
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await ProfileController.getProfile(req, res);
  },
);

profileRouter.patch(
  "/",
  configureMulter(
    ["tradeLicense", "passport", "emiratesId", "profilePicture", "bioVideo"],
    [AssetTypes.IMAGES, AssetTypes.VIDEOS, AssetTypes.DOCUMENTS],
  ),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateOptional("bio"),
    ...validateOptional("country"),
    ...validateOptional("name"),
    ...validateFBSocial,
    ...validateCoordinate("latitude", true),
    ...validateCoordinate("longitude", true),
    ...validateLinkedInSocial("linkedInSocial"),
    ...validateCalendlyLink,
    validate,
  ],
  extractUserFromToken,
  validateExistingProfile,
  validateOptionalFileUpload("profilePicture"),
  validateOptionalFileUpload("tradeLicense"),
  validateOptionalFileUpload("passport"),
  validateOptionalFileUpload("emiratesId"),
  validateOptionalFileUpload("bioVideo"),
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await ProfileController.updateProfile(req, res);
  },
);

profileRouter.post(
  "/add",
  configureMulter(
    ["tradeLicense", "passport", "emiratesId", "profilePicture", "bioVideo"],
    [AssetTypes.IMAGES, AssetTypes.VIDEOS, AssetTypes.DOCUMENTS],
  ),
  fileCleanupMiddleware,
  [
    ...validateToken,
    ...validateOptional("bio"),
    ...validateTitles("country"),
    ...validateFBSocial,
    ...validateCoordinate("latitude"),
    ...validateCoordinate("longitude"),
    ...validateLinkedInSocial("linkedInSocial"),
    ...validateCalendlyLink,
    validate,
  ],
  extractUserFromToken,
  validateNonExistingProfile,
  validateFileUpload("tradeLicense"),
  validateFileUpload("passport"),
  validateFileUpload("emiratesId"),
  validateOptionalFileUpload("profilePicture"),
  validateFileUpload("bioVideo"),
  validateUserVerification("isContactsVerfied"),
  async (req: Request, res: Response) => {
    await ProfileController.addProfile(req, res);
  },
);

export default profileRouter;
