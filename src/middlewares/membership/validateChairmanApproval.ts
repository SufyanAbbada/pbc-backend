import membershipApprovalRepository from "../../repositories/membershipApprovalRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { GeneralStatus, RoleId } from "../../common/enums";

const validateChairmanApproval: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { membershipId, user } = req.body;
    let eligibleForApproval = false;
    let eligibleForChairmanApproval = false;

    const membershipApproval =
      await membershipApprovalRepository.getMembershipApprovalsByMembershipId(
        Number(req.body.membershipId),
      );

    const approvalCount = membershipApproval.filter(
      (approval) => approval.status === GeneralStatus.APPROVED,
    ).length;

    const rejectionCount = membershipApproval.filter(
      (approval) => approval.status === GeneralStatus.REJECTED,
    ).length;

    if (Number(user.Role.id) === RoleId.CHAIRMAN) {
      eligibleForApproval = Number(approvalCount) + Number(rejectionCount) >= 3;
      if (!eligibleForApproval) {
        res.status(403).json({
          error: [
            {
              path: "userId",
              msg: "Chairman can only approve or reject after 3 approvals or rejections.",
            },
          ],
        });
        return;
      } else {
        const VC_FINANCE_APPROVAL =
          await membershipApprovalRepository.getMembershipApprovalByUserRole(
            Number(membershipId),
            RoleId.VC_FINANCE,
          );
        if (VC_FINANCE_APPROVAL.length === 0) {
          res.status(400).json({
            error: [
              {
                path: "userId",
                msg: "VC Finance approval is required before Chairman can approve or reject.",
              },
            ],
          });
          return;
        }
      }
    }

    if (
      (Number(user.Role.id) === RoleId.VC_FINANCE ||
        membershipApproval.some(
          (approval) => approval.user.Role.id === RoleId.VC_FINANCE,
        )) &&
      approvalCount + rejectionCount >= 2
    ) {
      eligibleForChairmanApproval = true;
    }

    req.body.eligibleForApproval = eligibleForApproval;
    req.body.eligibleForChairmanApproval = eligibleForChairmanApproval;
    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateChairmanApproval;
