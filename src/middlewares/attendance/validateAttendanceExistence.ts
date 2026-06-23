import AttendanceRepository from "../../repositories/attendanceRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler } from "express";

const validateAttendanceExistence: RequestHandler = async (req, res, next) => {
  const { user } = req.body;
  const today = new Date();

  try {
    const existing = await AttendanceRepository.findTodayAttendanceForUser(
      Number(user.id),
      today,
    );

    if (existing) {
      res.status(409).json({
        error: [
          {
            path: "attendance",
            msg: "Looks like you’ve already marked your attendance for today",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateAttendanceExistence;
