import EventApprovalRepository from "../repositories/EventApprovalRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import EventRepository from "../repositories/EventRepository";
import { EventMOMApprovalStatus } from "../common/enums";
import { Request, Response } from "express";

class EventApprovalController {
  async approveOrRejectMOM(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const {
        status,
        comment,
        approvalCount,
        user: { id: userId },
      } = req.body;

      const approval = await EventApprovalRepository.approveOrRejectMOM(
        Number(eventId),
        Number(userId),
        status,
        comment,
      );

      if (approval.status === EventMOMApprovalStatus.REJECTED)
        await EventRepository.updateEvent(Number(eventId), {
          eventMOMStatus: EventMOMApprovalStatus.REJECTED,
        });
      else if (
        Number(approvalCount) === 3 &&
        status === EventMOMApprovalStatus.APPROVED
      )
        await EventRepository.updateEvent(Number(eventId), {
          eventMOMStatus: EventMOMApprovalStatus.APPROVED,
        });

      return res.status(200).json({
        message: `Event MOM ${status.toLowerCase()} successfully`,
        data: approval,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getApprovals(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const approvals = await EventApprovalRepository.getApprovals(
        Number(eventId),
      );

      return res.status(200).json({
        message: "Approvals fetched successfully",
        data: approvals,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new EventApprovalController();
