import attendanceRepository from "../repositories/attendanceRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Attendance } from "../common/types";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";

class AttendanceController {
  async clockIn(req: Request, res: Response) {
    try {
      const { location, user } = req.body;

      const newAttendance = await attendanceRepository.createAttendance({
        locationIn: location,
        clockIn: new Date(),
        userId: Number(user.id),
      });

      return res.status(201).json({
        message: "Attendance marked in successfully.",
        data: newAttendance,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async clockOut(req: Request, res: Response) {
    try {
      const { location, attendance } = req.body;

      const markedAttendance = await attendanceRepository.updateAttendance(
        attendance.id,
        {
          locationOut: location,
          clockOut: new Date(),
        },
      );

      return res.status(200).json({
        message: "Attendance marked out successfully.",
        data: markedAttendance,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllAttendances(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user,
      } = req.body;

      const { attendances, totalCount } =
        await attendanceRepository.getAllAttendances(page, limit);

      return res.status(200).json({
        message: "All attendance records fetched successfully.",
        data: attendances,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyAttendances(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user,
      } = req.body;

      const { attendances, totalCount } =
        await attendanceRepository.getAttendancesByUserId(
          Number(user.id),
          page,
          limit,
        );

      return res.status(200).json({
        message: "Attendance records fetched successfully.",
        data: attendances,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getTodayAttendance(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const today = new Date();

      const todaysAttendance =
        await attendanceRepository.findTodayAttendanceForUser(
          Number(user.id),
          today,
        );

      if (!todaysAttendance)
        return res.status(404).json({
          error: [
            {
              path: "attendance",
              msg: "You haven't marked your attendance for today. Please make sure to do that!",
            },
          ],
        });

      return res.status(200).json({
        message: "Today's attendance fetched successfully.",
        data: todaysAttendance,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async getUserAttendances(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.body.pagination || {};

      const { attendances, totalCount } =
        await attendanceRepository.getAttendancesByUserId(
          Number(userId),
          page,
          limit,
        );

      return res.status(200).json({
        message: "Attendance for the user fetched successfully.",
        data: attendances,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTodaysTasks(req: Request, res: Response) {
    try {
      const { attendance, tasks } = req.body;

      const updatedAttendance = await attendanceRepository.updateAttendance(
        Number(attendance.id),
        {
          tasks,
        },
      );

      return res.status(200).json({
        message: "Tasks updated successfully for today.",
        data: updatedAttendance,
      });
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new AttendanceController();
