import AttendanceRepository from "../../repositories/attendanceRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler } from "express";

const validateAttendancePresence: RequestHandler = async (req, res, next) => {
  try {
    const { user } = req.body;

    const today = new Date();
    const attendance = await AttendanceRepository.findTodayAttendanceForUser(
      Number(user.id),
      today,
    );

    if (!attendance) {
      res.status(404).json({
        error: [
          {
            path: "attendance",
            msg: "You have not marked attendance for today or it's not updatable anymore.",
          },
        ],
      });
      return;
    }

    req.body.attendance = attendance;
    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateAttendancePresence;
