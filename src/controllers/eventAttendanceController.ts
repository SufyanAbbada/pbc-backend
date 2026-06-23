import EventAttendanceRepository from "../repositories/EventAttendanceRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";

class EventAttendanceController {
  async addAttendance(req: Request, res: Response) {
    try {
      const { event, userIds } = req.body;

      await EventAttendanceRepository.addUsersAttendance(
        event.eventId,
        userIds,
      );

      return res.status(201).json({
        message: "User's attendance added successfully",
        data: await EventAttendanceRepository.getEventDataWithUsers(
          event.eventId,
        ),
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getEventAttendance(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const eventAttendance =
        await EventAttendanceRepository.getEventDataWithUsers(Number(eventId));

      return res.status(200).json({
        message: "Event Attendance data fetched successfully",
        data: eventAttendance,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new EventAttendanceController();
