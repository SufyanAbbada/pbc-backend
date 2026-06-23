import UserRepository from "../repositories/UserRepository";
import OtpRepository from "../repositories/OtpRepository";
import UserRejectionRepository from "../repositories/UserRejectionRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import TempUserRepository from "../repositories/TempUserRepository";
import rolesAndPermissionsRepository from "../repositories/rolesAndPermissionsRepository";
import { Request, Response } from "express";
import { hashPassword, comparePassword } from "../utils/passwordHandler";
import { generateToken } from "../utils/jwtHandler";
import { TIME_STAMPS } from "../common/constants";
import { sendEmail, sendOtp, verifyOTP } from "../services/twilioService";
import { Otp, PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import {
  MembershipCategory,
  RoleId,
  RoleIdStr,
  UserStatus,
} from "../common/enums";
import { accountDeletionEmailTemplate } from "../templates/accountDeletionTemplate";

class UserController {
  async registerUser(req: Request, res: Response) {
    const { name, phoneNumber, email, password } = req.body;

    try {
      const emailOtp = await sendOtp("email", email);
      const phoneOtp = await sendOtp("sms", phoneNumber);
      if (!emailOtp || !phoneOtp) return;

      const newTempUser = await TempUserRepository.createTempUser({
        name,
        phoneNumber,
        email,
        password: await hashPassword(password),
        emailOtpExpiry: new Date(
          Date.now() + TIME_STAMPS.EMAIL_VERIFICATION_OTP_EXPIRE_TIME,
        ),
        phoneOtpExpiry: new Date(
          Date.now() + TIME_STAMPS.PHONE_VERIFICATION_OTP_EXPIRE_TIME,
        ),
        isEmailVerified: false,
        isPhoneVerified: false,
      });

      return res.status(201).json({
        message: "Verification OTPs sent successfully.",
        data: newTempUser,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async verifyUserOTP(req: Request, res: Response) {
    try {
      const { email, phoneNumber, phoneOtp, emailOtp, user } = req.body;
      let isContactsVerfied = user.isContactsVerfied;

      if (!isContactsVerfied) {
        const emailVerification = await verifyOTP(email, emailOtp, res);
        if (emailVerification?.status === "approved") {
          await TempUserRepository.updateTempEmailVerificationStatus(user.id);
        } else {
          return;
        }
        const phoneVerification = await verifyOTP(phoneNumber, phoneOtp, res);
        if (phoneVerification?.status === "approved") {
          await TempUserRepository.updateTempPhoneVerificationStatus(user.id);
        } else {
          return;
        }
        isContactsVerfied = true;
      }

      if (isContactsVerfied) {
        await TempUserRepository.deleteTempUserById(user.id);

        const newVerifiedUser = await UserRepository.createUser({
          name: user.name,
          phoneNumber: user.phoneNumber,
          email: user.email,
          password: user.password,
          isContactsVerfied,
          roleId: RoleId.INDIVIDUAL,
        });

        return res.status(201).json({
          message: "User verified and successfully registered.",
          data: newVerifiedUser,
        });
      } else {
        return res.status(400).json({
          error: [
            {
              path: "verifications",
              msg: "We weren't able to verify the user. Please check the details and try again",
            },
          ],
        });
      }
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async resendOtp(req: Request, res: Response) {
    try {
      const { email, phoneNumber, user } = req.body;
      const { isContactsVerfied } = user;

      if (!isContactsVerfied) {
        const emailOtpSent = await sendOtp("email", email);
        if (!emailOtpSent) return;

        const phoneOtpSent = await sendOtp("sms", phoneNumber);
        if (!phoneOtpSent) return;
      }

      await TempUserRepository.updateTempUserOtpsValidity(user.id);

      return res
        .status(202)
        .json({ message: "Verification OTPs resent successfully." });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async loginUser(req: Request, res: Response) {
    const { user, password } = req.body;

    try {
      if (await comparePassword(password, user.password)) {
        const getUser = await UserRepository.getUserById(user.id);
        return res.status(202).json({
          message: "Login Successful",
          data: generateToken(String(user.id)),
          user: {
            id: user.id,
            name: user.name,
            role: { id: getUser?.Role.id, name: getUser?.Role.name },
          },
        });
      } else
        return res.status(401).json({
          error: [
            {
              path: "login",
              msg: "The email or password you entered is incorrect. Please double-check and try again",
            },
          ],
        });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async forgetPassword(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const otpSendStatus = await sendOtp("email", user.email);
      if (!otpSendStatus) return;

      const otpData: Otp = {
        userId: user.id,
        otp: otpSendStatus.sid,
        expiresAt: new Date(
          Date.now() + TIME_STAMPS.RESET_PASSWORD_OTP_EXPIRE_TIME,
        ),
      };

      await OtpRepository.createOtp(otpData);

      return res.status(202).json({
        message:
          "Reset Password request received. OTP successfully generated and sent to your email.",
        data: "",
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async otpValidations(req: Request, res: Response) {
    try {
      const { userOtp, user } = req.body;

      const otpVerifyStatus = await verifyOTP(user.email, userOtp, res);

      if (!otpVerifyStatus) {
        return res.status(400).json({
          error: [
            {
              path: "resetOtp",
              msg: "We couldn’t verify the OTP. Please check the code and try again.",
            },
          ],
        });
      }

      if (otpVerifyStatus.status !== "approved") {
        return;
      }

      await OtpRepository.updateOtpVerificationStatus(user.id);

      return res.status(202).json({
        message: "OTP Validated successfully. You can Reset the Password now",
        data: "",
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { user, password } = req.body;

      await UserRepository.updateUserPassword(
        user.id,
        await hashPassword(password),
      );

      await OtpRepository.deleteOtp(Number(user.id));

      return res
        .status(200)
        .json({ message: "Password Updated successfully", data: "" });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyUser(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const userData = await UserRepository.getUserById(Number(userId));

      return res.status(200).json({
        message: "User fetched successfully",
        data: userData,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const userData = await UserRepository.getUserById(Number(userId));

      if (!userData) {
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find a user with the ID you provided. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "User fetched successfully",
        data: userData,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        roleIds,
      } = req.body;
      const { status, search } = req.query;

      let statusFilter: boolean | undefined;

      if (status) {
        statusFilter = status === UserStatus.ACTIVE ? true : false;
      }

      const { users, totalCount } = await UserRepository.getAllUsers(
        page,
        limit,
        statusFilter,
        roleIds as RoleId[],
        search as string,
      );

      const response: PaginationResponse = {
        message: "All Users fetched successfully",
        data: users,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async getUsersByMembershipCategory(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        roleIds,
      } = req.body;
      const { membershipCategory } = req.query;

      const { users, totalCount } =
        await UserRepository.findUsersByMembershipCategoryType(
          membershipCategory as MembershipCategory,
          page,
          limit,
          roleIds as RoleId[],
        );

      return res.status(200).json({
        message: `Users with ${membershipCategory} membership category fetched successfully`,
        data: users,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async getAllRoles(req: Request, res: Response) {
    try {
      const roles = await rolesAndPermissionsRepository.getAllRoles();
      return res.status(200).json({
        message: "All roles fetched successfully",
        data: roles,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async activateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const activatedUser = await UserRepository.updateUserStatus(
        Number(userId),
      );

      return res.status(200).json({
        message: "User activated Successfully",
        data: activatedUser,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async rejectUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { reason, authenticatedUser } = req.body;

      const rejectedUser = await UserRepository.deleteUser(Number(userId));

      await UserRejectionRepository.createNewRejectedUser({
        reason,
        email: rejectedUser.email,
        phoneNumber: rejectedUser.phoneNumber,
        rejectedBy: authenticatedUser.email,
      });

      return res.status(200).json({
        message:
          "The user's application has been rejected & removed from the system.",
        data: rejectedUser,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async getAllRejectedUsers(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;

      const { search } = req.query;

      const { rejections, totalCount } =
        await UserRejectionRepository.getAllRejectedUsers(
          search as string | undefined,
          page,
          limit,
        );

      const response: PaginationResponse = {
        message: "Rejected users fetched successfully",
        data: rejections,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getRejectionById(req: Request, res: Response) {
    try {
      const { rejectionId } = req.params;

      const rejection = await UserRejectionRepository.getRejectedUserById(
        Number(rejectionId),
      );

      if (!rejection) {
        return res.status(404).json({
          error: [
            {
              path: "rejectionId",
              msg: "We couldn't find a rejection with the ID you provided. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "User rejection fetched successfully",
        data: rejection,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async requestUserDeletion(req: Request, res: Response) {
    try {
      const { user } = req.body;

      await sendEmail(
        user.email,
        "Confirm Account Deletion Request",
        accountDeletionEmailTemplate(
          user.name,
          `${process.env.APP_URL}/authentication/confirm-deletion?token=${generateToken(String(user.id))}`,
        ),
      );

      return res.status(200).json({
        message:
          "Account deletion request received. Please check your email to confirm deletion.",
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const deletedUser = await UserRepository.deactivateUser(Number(user.id));

      return res.status(200).json({
        message:
          "Your account is deleted and your data has been removed from the system.",
        data: deletedUser,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async enableUser(req: Request, res: Response) {
    try {
      const { targetUser } = req.body;

      const enabledUser = await UserRepository.updateUserActivation(
        Number(targetUser.id),
        true,
      );

      return res.status(206).json({
        message: "User has been enabled successfully and can now log in.",
        data: enabledUser,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }

  async disableUser(req: Request, res: Response) {
    try {
      const { targetUser } = req.body;

      const disabledUser = await UserRepository.updateUserActivation(
        Number(targetUser.id),
        false,
      );

      return res.status(206).json({
        message:
          "User has been disabled and cannot access any resource in the system.",
        data: disabledUser,
      });
    } catch (err) {
      return generalErrorResponse(err, res);
    }
  }
}

export default new UserController();
