import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateAttendanceTiming: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      event: { startDate, endDate },
    } = req.body;

    const currentTime = new Date();

    if (currentTime < startDate || currentTime > endDate) {
      res.status(409).json({
        error: [
          {
            path: "eventId",
            msg: "Attendance can only be marked during the event's active period.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateAttendanceTiming;
