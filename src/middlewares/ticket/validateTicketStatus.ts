import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { TicketStatus } from "../../common/enums";

// * This middleware should only be placed after "validateTicketExistence" middleware as it depends upon it
const validateTicketStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ticket } = req.body;

    if (ticket.status === TicketStatus.CLOSED) {
      res.status(403).json({
        error: [
          {
            path: "ticketStatus",
            msg: "This ticket is closed and cannot be updated. Please create a new ticket",
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

export default validateTicketStatus;
