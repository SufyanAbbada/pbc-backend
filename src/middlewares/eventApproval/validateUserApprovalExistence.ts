//  validate if an approval for that eventId and userId already Exists middleware
import EventApprovalRepository from "../../repositories/EventApprovalRepository";
import { Request, Response } from "express";

const validateUserApprovalExistence = async (
  req: Request,
  res: Response,
  next: Function,
) => {
  const { eventId } = req.params;
  const {
    user: { id: userId },
  } = req.body;

  const approval = await EventApprovalRepository.getApprovalByEventIdAndUserId(
    Number(eventId),
    Number(userId),
  );
  if (approval) {
    res.status(404).json({
      error: [
        {
          path: "eventApprovalId",
          msg: "You already performed approval action for this event's MOM.",
        },
      ],
    });
    return;
  }
  next();
};

export default validateUserApprovalExistence;
