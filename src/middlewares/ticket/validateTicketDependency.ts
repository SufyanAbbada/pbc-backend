import ResponseRepository from "../../repositories/ResponseRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateDependingTicketResponses: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ticketId } = req.params;

  const dependentTickets = await ResponseRepository.getResponsesByTicketId(
    Number(ticketId),
  );

  if (dependentTickets?.length > 0) {
    res.status(403).json({
      error: [
        {
          path: "ticketId",
          msg: "You cannot delete this Ticket as this is being used by other members and being in discussion.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateDependingTicketResponses;
