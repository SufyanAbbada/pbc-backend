import { EventMOMApprovalStatus } from "../common/enums";
import prisma from "../config/prismaClient";

class EventApprovalRepository {
  async approveOrRejectMOM(
    eventId: number,
    userId: number,
    status: EventMOMApprovalStatus,
    comment?: string,
  ) {
    return await prisma.eventMOMApproval.create({
      data: {
        eventId,
        userId,
        status,
        comment,
      },
    });
  }

  async getApprovalByEventIdAndUserId(eventId: number, userId: number) {
    return await prisma.eventMOMApproval.findFirst({
      where: { eventId, userId },
    });
  }

  async deleteApprovals(eventId: number) {
    return await prisma.eventMOMApproval.deleteMany({
      where: { eventId },
    });
  }

  async getApprovals(eventId: number) {
    return await prisma.eventMOMApproval.findMany({
      where: { eventId },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });
  }
}

export default new EventApprovalRepository();
