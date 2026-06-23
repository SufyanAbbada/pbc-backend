import MembershipRegistrationController from "../controllers/membershipRegistrationController";
import validateToken from "../middlewares/token/validateToken";
import validate from "../middlewares/globalErrorHandler";
import validateTitles from "../middlewares/global/validateTitles";
import validateDateField from "../middlewares/global/validateDate";
import validateRegistrationNumbers from "../middlewares/global/validateRegistrationNumbers";
import validateEmiratesId from "../middlewares/global/validateEmiratesId";
import validateAndParseDate from "../middlewares/global/validateAndParseDate";
import validateYearField from "../middlewares/global/validateYearField";
import validateUrl from "../middlewares/global/validateUrl";
import validateIntegerField from "../middlewares/global/validateIntegerField";
import validatePersonalInfo from "../middlewares/membership/validatePersonalInfo";
import validateBusinessInfo from "../middlewares/membership/validateBusinessInfo";
import validatePrimaryShareholderInfo from "../middlewares/membership/validatePrimaryShareholderInfo";
import validateMembershipPreferences from "../middlewares/membership/validateMembershipSpecificInto";
import validateProfessionalInfo from "../middlewares/membership/validateProfessionalInfo";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateUserVerification from "../middlewares/global/validateUserVerification";
import validateMembershipExistence from "../middlewares/membership/validateMembershipExistence";
import validateHsCodesFormat from "../middlewares/membership/validateHsCodesFormat";
import validateOptional from "../middlewares/global/validateOptionalField";
import validateOptionalNumericField from "../middlewares/global/validateOptionalNumericField";
import validateMembershipFieldExistence from "../middlewares/membership/validateMembershipFieldExistence";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateArray from "../middlewares/global/validateArray";
import validateEnumField from "../middlewares/global/validateStatus";
import validateBusinessGroups from "../middlewares/businessGroup/validateBusinessGroups";
import { Router, Request, Response } from "express";
import {
  Action,
  AgreeOrNot,
  DateType,
  MembershipCategory,
  Subject,
} from "../common/enums";

const membershipRegistrationRouter = Router();

membershipRegistrationRouter.post(
  "/personal-info",
  [
    ...validateToken,
    ...validateDateField("dateOfBirth"),
    ...validateRegistrationNumbers("passportNumber"),
    ...validateDateField("passportExpiryDate"),
    ...validateEmiratesId,
    ...validateDateField("emiratesIdExpiryDate"),
    ...validateTitles("address"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.MEMBERSHIP_REGISTRATION),
  validateMembershipExistence,
  validateMembershipFieldExistence("emiratesId", "emiratesId"),
  validateMembershipFieldExistence("passportNumber", "passportNumber"),
  validateAndParseDate("dateOfBirth", DateType.PAST),
  validateAndParseDate("passportExpiryDate", DateType.FUTURE),
  validateAndParseDate("emiratesIdExpiryDate", DateType.FUTURE),
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.createPersonalInfo(req, res);
  },
);

membershipRegistrationRouter.post(
  "/business-info",
  [
    ...validateToken,
    ...validateTitles("companyName"),
    ...validateTitles("city"),
    ...validateTitles("country"),
    ...validateRegistrationNumbers("tradeLicenseNumber"),
    ...validateDateField("tradeLicenseExpiry"),
    ...validateYearField("yearOfEstablishment"),
    ...validateTitles("affiliation"),
    ...validateTitles("legalStatus"),
    ...validateTitles("natureOfBusiness"),
    ...validateArray("businessGroup", "int", true, 1, 1),
    ...validateTitles("emiratesIssuingAuthority"),
    ...validateArray("keywords"),
    ...validateArray("hsCodes"),
    ...validateHsCodesFormat,
    ...validateUrl,
    ...validateIntegerField("noOfEmployees"),
    ...validateRegistrationNumbers("vatRegistrationNumber"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.MEMBERSHIP_REGISTRATION),
  validateMembershipFieldExistence("tradeLicenseNumber", "tradeLicenseNumber"),
  validateMembershipFieldExistence(
    "vatRegistrationNumber",
    "vatRegistrationNumber",
  ),
  validateBusinessGroups,
  validateAndParseDate("tradeLicenseExpiry", DateType.FUTURE),
  validatePersonalInfo,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.createBusinessInfo(req, res);
  },
);

membershipRegistrationRouter.post(
  "/membership-specific-info",
  [
    ...validateToken,
    ...validateArray("keyObjectives"),
    ...validateArray("areaOfInterest"),
    ...validateTitles("expectations"),
    ...validateTitles("selfDescription"),
    ...validateEnumField("clientIntroductionComfort", AgreeOrNot),
    ...validateEnumField("businessTrainingInterest", AgreeOrNot),
    ...validateTitles("councilDiscoveryMethod"),
    ...validateEnumField("membershipCategory", MembershipCategory),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.MEMBERSHIP_REGISTRATION),
  validateProfessionalInfo,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.membershipSpecificInfo(req, res);
  },
);

membershipRegistrationRouter.post(
  "/primary-shareholder-info",
  [
    ...validateToken,
    ...validateTitles("shareHolderStatus"),
    ...validateArray("otherShareHoldersName"),
    ...validateOptional("annualRevenue"),
    ...validateOptionalNumericField("ownershipPercentage"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.MEMBERSHIP_REGISTRATION),
  validateBusinessInfo,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.createPrimaryShareholderInfo(
      req,
      res,
    );
  },
);

membershipRegistrationRouter.post(
  "/secondary-shareholder-info",
  [...validateToken, ...validateArray("references"), validate],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.MEMBERSHIP_REGISTRATION),
  validateMembershipPreferences,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.createSecondaryShareholderInfo(
      req,
      res,
    );
  },
);

membershipRegistrationRouter.post(
  "/professional-info",
  [
    ...validateToken,
    ...validateTitles("professionalTitle"),
    ...validateIntegerField("yearsOfExperience"),
    ...validateArray("languagesSpoken"),
    ...validateArray("primeClients"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.CREATE, Subject.MEMBERSHIP_REGISTRATION),
  validatePrimaryShareholderInfo,
  validateUserVerification("isProfileVerified"),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.createProfessionalInfo(req, res);
  },
);

membershipRegistrationRouter.get(
  "/my/memberships",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.MEMBERSHIP_REGISTRATION),
  async (req: Request, res: Response) => {
    await MembershipRegistrationController.getMyMembershipRegistration(
      req,
      res,
    );
  },
);

export default membershipRegistrationRouter;
