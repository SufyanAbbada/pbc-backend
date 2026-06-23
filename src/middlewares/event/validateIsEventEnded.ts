import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction } from "express";

const validateEventEnded = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { eventId } = req.params;

  const event = await EventRepository.getEventById(Number(eventId));

  if (event && event.endDate > new Date()) {
    res.status(403).json({
      error: [
        {
          path: "eventId",
          msg: "Event is not ended yet. Please check back later.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateEventEnded;
