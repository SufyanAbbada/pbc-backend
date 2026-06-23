import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateEventExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const eventId =
      source === SourceType.BODY ? req.body.eventId : req.params.eventId;

    if (eventId) {
      const event = await EventRepository.getEventById(Number(eventId));

      if (!event) {
        res.status(404).json({
          error: [
            {
              path: "eventId",
              msg: "We couldn't find the event. Please recheck the event ID",
            },
          ],
        });
        return;
      }
    }

    next();
  };
};

export default validateEventExistence;
