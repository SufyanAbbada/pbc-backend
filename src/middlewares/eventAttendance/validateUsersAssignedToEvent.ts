import EventsAttendanceRepository from "../../repositories/EventAttendanceRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateUsersAssignedToEvent: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { event, userIds } = req.body;

  const assignedEventUsers =
    await EventsAttendanceRepository.getUsersAssignedToEvent(event.eventId);

  const matchingUserIds = userIds.filter((userId: number) =>
    assignedEventUsers.map((user) => user.userId).includes(userId),
  );

  if (matchingUserIds.length === 0) {
    res.status(400).json({
      error: [
        {
          path: "userIds",
          msg: "None of the provided user IDs are assigned to this event.",
        },
      ],
    });
    return;
  }

  req.body.userIds = matchingUserIds;
  next();
};

export default validateUsersAssignedToEvent;
