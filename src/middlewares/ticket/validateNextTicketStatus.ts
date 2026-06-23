import generalErrorResponse from "../../utils/generalErrorResponse";
import getNextTicketStatus from "../../utils/getNextTicketStatus";
import { Request, Response, NextFunction } from "express";
import { TicketStatus } from "../../common/enums";

// * This middleware must be used after the task & user existence middleware
const validateNextTicketStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ticket, status } = req.body;

    if (ticket.status === TicketStatus.CLOSED) {
      res.status(406).json({
        error: [
          {
            path: "status",
            msg: `This Ticket is already Closed. Its Status cannot be changed now`,
          },
        ],
      });
      return;
    } else if (ticket.status === status) {
      res.status(403).json({
        error: [
          {
            path: "status",
            msg: "This ticket is already in the specified status. Please choose a different status to update",
          },
        ],
      });
      return;
    } else if (status !== getNextTicketStatus(ticket.status)) {
      res.status(403).json({
        error: [
          {
            path: "status",
            msg: `This ticket can only transition to the '${getNextTicketStatus(ticket.status)}' status next.`,
          },
        ],
      });
      return;
    }
    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateNextTicketStatus;
