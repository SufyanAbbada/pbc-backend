import prisma from "../config/prismaClient";
import { Attendance } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { DateTime } from "luxon";

class AttendanceRepository {
  async findTodayAttendanceForUser(userId: number, today: Date) {
    const startOfDay = DateTime.fromJSDate(today).startOf("day").toJSDate();
    const endOfDay = DateTime.fromJSDate(today).endOf("day").toJSDate();

    return prisma.attendance.findFirst({
      where: {
        userId,
        clockIn: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async createAttendance(attendanceData: Attendance) {
    return prisma.attendance.create({
      data: attendanceData,
    });
  }

  async updateAttendance(id: number, attendanceData: Partial<Attendance>) {
    return prisma.attendance.update({
      where: { id },
      data: attendanceData,
    });
  }

  async getAllAttendances(page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [attendances, totalCount] = await Promise.all([
      prisma.attendance.findMany({
        skip,
        take: limit,
        orderBy: { clockIn: "desc" },
        include: { user: { select: { id: true, name: true } } },
      }),
      prisma.attendance.count(),
    ]);

    return { attendances, totalCount };
  }

  async getAttendancesByUserId(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [attendances, totalCount] = await Promise.all([
      prisma.attendance.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { clockIn: "desc" },
      }),
      prisma.attendance.count({ where: { userId } }),
    ]);

    return { attendances, totalCount };
  }
}
export default new AttendanceRepository();
