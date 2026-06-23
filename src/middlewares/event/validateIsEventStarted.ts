import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction } from "express";

const validateEventNotStarted = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { eventId } = req.params;

  const event = await EventRepository.getEventById(Number(eventId));

  if (event && event.startDate > new Date()) {
    res.status(403).json({
      error: [
        {
          path: "eventId",
          msg: "Event has not started yet. Please check back later.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateEventNotStarted;
