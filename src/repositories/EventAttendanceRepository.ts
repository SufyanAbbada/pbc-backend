import prisma from "../config/prismaClient";
import { EventAttendanceStatus } from "@prisma/client";
import { EventAttendance } from "../common/types";

class EventAttendanceRepository {
  async registerEventAttendance(eventAttendance: EventAttendance) {
    return prisma.eventAttendance.createMany({
      data: eventAttendance,
    });
  }

  async getUsersAssignedToEvent(eventId: number) {
    return prisma.eventAttendance.findMany({
      where: { eventId },
      select: {
        userId: true,
      },
    });
  }

  async addUsersAttendance(eventId: number, userIds: number[]) {
    return await prisma.eventAttendance.updateMany({
      where: { eventId, userId: { in: userIds } },
      data: { status: EventAttendanceStatus.ATTENDED },
    });
  }

  async getEventDataWithUsers(eventId: number) {
    return prisma.eventAttendance.findMany({
      where: { eventId },
      omit: { createdAt: true, updatedAt: true },
      include: {
        event: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
    });
  }
}

export default new EventAttendanceRepository();
