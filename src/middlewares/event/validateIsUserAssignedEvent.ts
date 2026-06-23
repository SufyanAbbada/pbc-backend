import Events from "../../repositories/EventRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateIsUserAssignedEvent: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { eventId } = req.params;
  const {
    user: { id },
  } = req.body;

  const event = await Events.checkUserAssignedEvent(
    Number(id),
    Number(eventId),
  );

  if (!event) {
    res.status(404).json({
      error: [
        {
          path: "eventId",
          msg: "This user is not invited to this event",
        },
      ],
    });
    return;
  }

  next();
};

export default validateIsUserAssignedEvent;
