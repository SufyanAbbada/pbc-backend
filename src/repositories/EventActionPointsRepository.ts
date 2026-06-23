import prisma from "../config/prismaClient";
import { EventActionPointStatus } from "../common/enums";

class EventActionPointRepository {
  async bulkCreateActionPoints(eventId: number, descriptions: string[]) {
    return await prisma.eventActionPoint.createMany({
      data: descriptions.map((description) => ({
        eventId,
        description,
        status: EventActionPointStatus.PENDING,
      })),
    });
  }

  async markPendingActionPointsAsTransferred() {
    return await prisma.eventActionPoint.updateMany({
      where: {
        status: EventActionPointStatus.PENDING,
      },
      data: {
        status: EventActionPointStatus.TRANSFERRED,
      },
    });
  }

  async getRecentPendingActionPoints() {
    return await prisma.eventActionPoint.findMany({
      where: {
        status: EventActionPointStatus.PENDING,
      },
    });
  }

  getActionPointById(id: number) {
    return prisma.eventActionPoint.findUnique({
      where: { id },
    });
  }

  async updateActionPointStatus(id: number, status: EventActionPointStatus) {
    return await prisma.eventActionPoint.update({
      where: { id },
      data: { status },
    });
  }
}

export default new EventActionPointRepository();
