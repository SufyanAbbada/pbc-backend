import MembershipApprovalRepository from "../repositories/membershipApprovalRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import UserRepository from "../repositories/UserRepository";
import membershipRepository from "../repositories/membershipRepository";
import expoNotificationService from "../services/expoNotificationService";
import { Request, Response } from "express";
import { RoleId, UpdateGeneralStatus } from "../common/enums";
import { sendEmail } from "../services/twilioService";
import {
  membershipCompletedTemplate,
  membershipReviewTemplate,
} from "../templates/membershipTemplates";
import { MANAGEMENT_ROLES } from "../common/constants";

class MembershipApprovalController {
  async createMembershipApproval(req: Request, res: Response) {
    try {
      const {
        status,
        comment,
        membershipId,
        eligibleForApproval,
        eligibleForChairmanApproval,
        user: { id: userId, name, email },
      } = req.body;

      const membership =
        await MembershipApprovalRepository.addMembershipApproval({
          membershipId: Number(membershipId),
          status,
          userId: Number(userId),
          comment,
        });

      if (eligibleForApproval) {
        const updatedMembership =
          await membershipRepository.updateMembershipStatus(
            Number(membershipId),
            status,
          );

        if (status === UpdateGeneralStatus.APPROVED) {
          await UserRepository.updateUserMembershipVerification(
            Number(updatedMembership.userId),
            true,
          );

          await expoNotificationService.sendMultiUserNotification(
            [updatedMembership.userId],
            `Membership Approved`,
            `Your membership has been approved for Pakistan Business Council.`,
            {
              type: "MEMBERSHIP_NOTIFICATION",
            },
          );
        }
      }

      const { users } = await UserRepository.getAllUsers(
        undefined,
        undefined,
        undefined,
        [
          ...MANAGEMENT_ROLES,
          ...(eligibleForApproval || eligibleForChairmanApproval
            ? [RoleId.CHAIRMAN]
            : []),
        ],
      );
      const membershipEmailTasks = users.map((user) =>
        sendEmail(
          user.email,
          `Membership ${status[0] + status.slice(1).toLowerCase()}`,
          eligibleForApproval
            ? membershipCompletedTemplate(
                user.name,
                membership.membership.user.name,
                membership.membership.user.email,
              )
            : membershipReviewTemplate(
                user.name,
                name,
                email,
                status,
                comment,
                membershipId,
              ),
        ),
      );
      await Promise.all(membershipEmailTasks);

      await expoNotificationService.sendMultiUserNotification(
        users.map((user) => user.id),
        "Membership Update",
        eligibleForApproval
          ? `Membership of the user ${membership.membership.user.name} has been ${status.toLowerCase()}.`
          : `A membership decision has been made by ${name} for the user ${membership.membership.user.name}. Please check your email for details.`,
      );

      return res.status(201).json({
        message: "Membership Approval created successfully",
        data: membership,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMembershipApproval(req: Request, res: Response) {
    try {
      const { membershipId } = req.params;

      const membershipApproval =
        await MembershipApprovalRepository.getMembershipApprovalsByMembershipId(
          Number(membershipId),
        );

      return res.status(200).json({
        message: "Membership Approval fetched successfully",
        data: membershipApproval,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new MembershipApprovalController();
