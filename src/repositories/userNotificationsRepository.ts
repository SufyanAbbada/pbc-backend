import prisma from "../config/prismaClient";
import { UserNotificationStatus } from "../common/enums";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class UserNotificationRepository {
  async createNotification(userId: number, message: string) {
    return prisma.userNotification.create({
      data: { userId, message },
    });
  }

  async getNotificationsByUserId(
    userId: number,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const [notifications, totalCount] = await Promise.all([
      prisma.userNotification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          message: true,
          status: true,
          createdAt: true,
        },
      }),
      prisma.userNotification.count({
        where: { userId },
      }),
    ]);

    return { notifications, totalCount };
  }

  async getUnreadNotifications(userId: number) {
    return prisma.userNotification.findMany({
      where: { userId, status: UserNotificationStatus.UNREAD },
      orderBy: { createdAt: "desc" },
      select: {
        message: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async markAllAsRead(userId: number) {
    return prisma.userNotification.updateMany({
      where: { userId, status: UserNotificationStatus.UNREAD },
      data: { status: UserNotificationStatus.READ },
    });
  }
}

export default new UserNotificationRepository();
