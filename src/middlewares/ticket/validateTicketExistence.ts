import ticketRepository from "../../repositories/ticketRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateTicketExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const ticketId =
      source === SourceType.BODY ? req.body.ticketId : req.params.ticketId;

    const ticket = await ticketRepository.getTicketById(Number(ticketId));

    if (!ticket) {
      res.status(404).json({
        error: [
          {
            path: "ticketId",
            msg: "We couldn’t find this ticket. Please recheck the ticket ID",
          },
        ],
      });
      return;
    }

    req.body.ticket = ticket;

    next();
  };
};

export default validateTicketExistence;
