import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { EventType, SourceType } from "../../common/enums";

const validatePrevBoardMeetingEnded = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { eventType } = source === SourceType.BODY ? req.body : req.params;

    if (eventType === EventType.BOARD_MEETING) {
      const event = await EventRepository.getRecentEventByType(
        EventType.BOARD_MEETING,
      );

      if (event && event.endDate > new Date()) {
        res.status(400).json({
          error: [
            {
              path: "eventId",
              msg: "The previous Board Meeting has not concluded yet. Please wait until it ends",
            },
          ],
        });
        return;
      }
    }

    next();
  };
};

export default validatePrevBoardMeetingEnded;
