import MembershipApprovalRepository from "../repositories/membershipApprovalRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import UserRepository from "../repositories/UserRepository";
import membershipRepository from "../repositories/membershipRepository";
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

          console.info(
            `[Notification] Membership approval processed for user ${updatedMembership.userId}. Expo push is disabled.`,
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

      console.info(
        `[Notification] Membership update emails processed for ${users.length} users. Expo push is disabled.`,
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
