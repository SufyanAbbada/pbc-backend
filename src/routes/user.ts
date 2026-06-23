import UserController from "../controllers/userController";
import validateTitles from "../middlewares/global/validateTitles";
import validateEmail from "../middlewares/auth/validateEmail";
import validatePassword from "../middlewares/auth/validatePassword";
import validatePhone from "../middlewares/auth/validatePhone";
import validateToken from "../middlewares/token/validateToken";
import validateOTP from "../middlewares/otp/validateOTP";
import validate from "../middlewares/globalErrorHandler";
import validateUserUniqueness from "../middlewares/auth/validateUserUniqueness";
import validateUserExistenceByEmail from "../middlewares/auth/validateUserExistenceByEmail";
import validateOTPExistence from "../middlewares/otp/validateExistingOTP";
import validateOTPValidity from "../middlewares/otp/validateOTPValidity";
import validateId from "../middlewares/global/validateId";
import validateUserActivation from "../middlewares/auth/validateUserActivation";
import validateUserExistenceByIdParam from "../middlewares/auth/validateUserExistenceByIdParam";
import validateUserExistenceById from "../middlewares/auth/validateUserExistenceById";
import validateUserVerification from "../middlewares/auth/validateUserVerification";
import validateUserMembership from "../middlewares/global/validateUserVerification";
import validateOtpVerification from "../middlewares/otp/validateOtpVerification";
import extractUserFromToken from "../middlewares/token/extractUserFromToken";
import validateVerifiedUser from "../middlewares/auth/validateVerifiedUser";
import validateUserActiveStatus from "../middlewares/auth/validateUserActiveStatus";
import validateUserDeletionStatus from "../middlewares/auth/validateIsDeletedUser";
import validateQueryParams from "../middlewares/global/validatePaginationQueryParams";
import parsePaginationParams from "../middlewares/global/parsePaginationParams";
import extractUserFromBody from "../middlewares/auth/extractUserFromBody";
import validateEnumQueryParam from "../middlewares/global/validateEnumQueryParam";
import validatePermissions from "../middlewares/global/validatePermissions";
import validateQueryField from "../middlewares/global/validateSearchQuery";
import processExistingTempUser from "../middlewares/auth/processExistingTempUser";
import validateTempUserExistence from "../middlewares/auth/validateTempUserExistence";
import validateRoleIds from "../middlewares/auth/validateRoleIds";
import requestRateLimiter from "../middlewares/requestRateLimiter";
import verifyOtpsValidity from "../middlewares/auth/verifyOtpsValidity";
import { Router, Request, Response } from "express";
import {
  Action,
  MembershipCategory,
  Subject,
  UserStatus,
} from "../common/enums";

const userRouter = Router();

userRouter.post(
  "/register",
  [
    requestRateLimiter,
    ...validateTitles("name"),
    ...validatePhone,
    ...validateEmail(),
    ...validatePassword,
    validateUserUniqueness,
    processExistingTempUser,
    validate,
  ],
  async (req: Request, res: Response): Promise<void> => {
    await UserController.registerUser(req, res);
  },
);

userRouter.post(
  "/verify-user",
  [
    ...validatePhone,
    ...validateEmail(),
    ...validateOTP("phoneOtp"),
    ...validateOTP("emailOtp"),
    validate,
  ],
  extractUserFromToken,
  validateTempUserExistence,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.verifyUserOTP(req, res);
  },
);

userRouter.post(
  "/login",
  [...validateEmail(), ...validatePassword, validate],
  validateUserExistenceByEmail,
  validateUserDeletionStatus,
  validateUserVerification,
  validateUserActivation,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.loginUser(req, res);
  },
);

userRouter.post(
  "/request-deletion",
  [...validateEmail(), validate],
  validateUserExistenceByEmail,
  validateUserDeletionStatus,
  validateUserVerification,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.requestUserDeletion(req, res);
  },
);

userRouter.delete(
  "/confirm-deletion",
  [...validateToken, validate],
  extractUserFromToken,
  async (req: Request, res: Response) => {
    await UserController.deleteUser(req, res);
  },
);

userRouter.get(
  "/",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.USER),
  async (req: Request, res: Response) => {
    await UserController.getMyUser(req, res);
  },
);

userRouter.get(
  "/roles",
  [...validateToken, validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.USER),
  async (req: Request, res: Response) => {
    await UserController.getAllRoles(req, res);
  },
);

userRouter.get(
  "/membership-category",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateEnumQueryParam("membershipCategory", MembershipCategory),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.USER),
  validateRoleIds,
  validateUserMembership("isMembershipVerified"),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await UserController.getUsersByMembershipCategory(req, res);
  },
);

userRouter.get(
  "/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.USER),
  async (req: Request, res: Response) => {
    await UserController.getUserById(req, res);
  },
);

userRouter.get(
  "/all/users",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateEnumQueryParam("status", UserStatus),
    ...validateQueryField("search"),
    validate,
  ],
  extractUserFromToken,
  validateRoleIds,
  validatePermissions(Action.READ, Subject.USER),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await UserController.getAllUsers(req, res);
  },
);

userRouter.patch(
  "/activate-user/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.USER),
  validateUserExistenceById,
  validateUserExistenceByIdParam,
  async (req: Request, res: Response) => {
    await UserController.activateUser(req, res);
  },
);

userRouter.patch(
  "/reject-user/:userId",
  [
    ...validateToken,
    ...validateId("userId"),
    ...validateTitles("reason"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.USER),
  validateUserExistenceById,
  extractUserFromBody("authenticatedUser"),
  validateUserExistenceByIdParam,
  validateUserActiveStatus,
  async (req: Request, res: Response) => {
    await UserController.rejectUser(req, res);
  },
);

userRouter.patch(
  "/enable-user/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.USER),
  validateUserExistenceByIdParam,
  async (req: Request, res: Response) => {
    await UserController.enableUser(req, res);
  },
);

userRouter.patch(
  "/disable-user/:userId",
  [...validateToken, ...validateId("userId"), validate],
  extractUserFromToken,
  validatePermissions(Action.APPROVE, Subject.USER),
  validateUserExistenceByIdParam,
  async (req: Request, res: Response) => {
    await UserController.disableUser(req, res);
  },
);

userRouter.get(
  "/rejections/all",
  [
    ...validateToken,
    ...validateQueryParams("page"),
    ...validateQueryParams("limit"),
    ...validateQueryField("search"),
    validate,
  ],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.USER),
  parsePaginationParams,
  async (req: Request, res: Response) => {
    await UserController.getAllRejectedUsers(req, res);
  },
);

userRouter.get(
  "/rejections/:rejectionId",
  [...validateToken, ...validateId("rejectionId"), validate],
  extractUserFromToken,
  validatePermissions(Action.READ, Subject.USER),
  async (req: Request, res: Response) => {
    await UserController.getRejectionById(req, res);
  },
);

userRouter.post(
  "/forget-password",
  [...validateEmail(), validate],
  validateUserExistenceByEmail,
  validateUserVerification,
  validateOTPExistence,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.forgetPassword(req, res);
  },
);

userRouter.post(
  "/otp-validation",
  [...validateOTP("resetOtp"), ...validateEmail(), validate],
  validateUserExistenceByEmail,
  validateUserVerification,
  validateOTPValidity,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.otpValidations(req, res);
  },
);

userRouter.post(
  "/reset-password",
  [
    ...validateEmail(),
    ...validatePassword,
    validateUserExistenceByEmail,
    validate,
  ],
  validateOtpVerification,
  validateUserVerification,
  validateUserActivation,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.resetPassword(req, res);
  },
);

userRouter.post(
  "/resend-otp",
  [...validatePhone, ...validateEmail(), validate],
  extractUserFromToken,
  validateTempUserExistence,
  validateVerifiedUser,
  verifyOtpsValidity,
  async (req: Request, res: Response): Promise<void> => {
    await UserController.resendOtp(req, res);
  },
);

export default userRouter;
