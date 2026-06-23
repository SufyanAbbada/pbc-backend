import MembershipApprovalRepository from "../../repositories/membershipApprovalRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateExistingApprovalByUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      user: { id: userId },
    } = req.body;

    const membershipApproval =
      await MembershipApprovalRepository.getMembershipApprovalsByMembershipId(
        Number(req.body.membershipId),
      );

    if (
      membershipApproval.some((approval) => approval.userId === Number(userId))
    ) {
      res.status(400).json({
        error: [
          {
            path: "membershipId",
            msg: "You have already submitted an approval/rejection.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateExistingApprovalByUser;
