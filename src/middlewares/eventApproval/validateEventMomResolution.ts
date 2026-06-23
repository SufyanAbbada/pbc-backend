import EventApprovalRepository from "../../repositories/EventApprovalRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { EventMOMApprovalStatus } from "../../common/enums";

const validateEventApprovalResolution: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventId } = req.params;
    const eventMOMApprovals = await EventApprovalRepository.getApprovals(
      Number(eventId),
    );

    const approvalCount = eventMOMApprovals.filter(
      (approval) => approval.status === EventMOMApprovalStatus.APPROVED,
    ).length;

    if (approvalCount >= 4) {
      res.status(400).json({
        error: [
          {
            path: "eventId",
            msg: "The event has already been approved and cannot be approved again",
          },
        ],
      });
      return;
    }

    const rejectionExists = eventMOMApprovals.some(
      (approval) => approval.status === EventMOMApprovalStatus.REJECTED,
    );

    if (rejectionExists) {
      res.status(400).json({
        error: [
          {
            path: "eventId",
            msg: "The event has already been rejected and cannot be rejected again",
          },
        ],
      });
      return;
    }

    req.body.approvalCount = approvalCount;

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateEventApprovalResolution;
