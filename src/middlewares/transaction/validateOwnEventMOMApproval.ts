import EventRepository from "../../repositories/EventRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import generalErrorResponse from "../../utils/generalErrorResponse";

const validateOwnEventMOMApproval: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { eventId } = req.params;
    const { user } = req.body;

    const event = await EventRepository.getEventById(Number(eventId));

    if (event?.eventMOMEditorId === user.id) {
      res.status(400).json({
        error: [
          {
            path: "eventId",
            msg: "You cannot approve MOM of your own event",
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

export default validateOwnEventMOMApproval;
