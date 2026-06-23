import prisma from "../config/prismaClient";
import { ActivityLog } from "@prisma/client";
import { ActivityLog as ActivityLogType } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class ActivityLogRepository {
  async createActivityLog(data: ActivityLogType) {
    return await prisma.activityLog.create({ data });
  }

  async getAllActivityLogs(
    page?: number,
    limit?: number,
    filters?: Partial<ActivityLog>,
  ): Promise<{
    logs: ActivityLog[];
    totalCount: number;
  }> {
    const skip = calculatePaginationSkip(page, limit);

    const whereClause = {
      ...(filters?.interaction && { interaction: filters.interaction }),
      ...(filters?.interactionType && {
        interactionType: filters.interactionType,
      }),
      ...(filters?.interactedUserId && {
        interactedUserId: filters.interactedUserId,
      }),
      ...(filters?.observerId && { observerId: filters.observerId }),
    };

    const [logs, totalCount] = await Promise.all([
      prisma.activityLog.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          Observer: {
            select: { id: true, name: true, email: true, phoneNumber: true },
          },
          InteractedUser: {
            select: { id: true, name: true, email: true, phoneNumber: true },
          },
        },
      }),
      prisma.activityLog.count({ where: whereClause }),
    ]);

    return { logs, totalCount };
  }
}

export default new ActivityLogRepository();
