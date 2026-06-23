import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction } from "express";

//use this after actionPointExistence middleware
const validateEventAgainstActionPoint = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { actionPoint } = req.body;

  const event = await EventRepository.getEventById(Number(actionPoint.eventId));

  if (event && event.startDate > new Date()) {
    res.status(403).json({
      error: [
        {
          path: "eventId",
          msg: "The event hasn't started yet. You can add Action Points once it begins",
        },
      ],
    });
    return;
  }

  next();
};

export default validateEventAgainstActionPoint;
