import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler } from "express";

// * This middleware must be used after `validateAttendancePresence` middleware
const validateAttendanceClockedOut: RequestHandler = async (req, res, next) => {
  try {
    const { attendance } = req.body;

    if (attendance.clockOut) {
      res.status(409).json({
        error: [
          {
            path: "attendance",
            msg: "You've already marked your attendance for today. You can't mark again",
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

export default validateAttendanceClockedOut;
