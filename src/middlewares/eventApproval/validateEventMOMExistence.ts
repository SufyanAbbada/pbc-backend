import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateMOMExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { eventId } = req.params;

  const event = await EventRepository.getEventById(Number(eventId));

  if (event && !event.eventMOM) {
    res.status(404).json({
      error: [
        {
          path: "eventMOM",
          msg: "We couldn't find the event MOM (Minutes of Meeting) for this event",
        },
      ],
    });
    return;
  }

  next();
};

export default validateMOMExistence;
