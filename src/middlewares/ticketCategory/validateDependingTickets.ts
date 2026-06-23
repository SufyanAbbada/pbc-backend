import TicketRepository from "../../repositories/ticketRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateDependingTickets: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { ticketCategoryId } = req.params;

  const dependentTickets = await TicketRepository.getTicketsByCategoryId(
    Number(ticketCategoryId),
  );

  if (dependentTickets?.length > 0) {
    res.status(403).json({
      error: [
        {
          path: "ticketCategoryId",
          msg: "You cannot delete this transaction category because it is associated with existing tickets.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateDependingTickets;
