import TicketCategoryRepository from "../../repositories/TicketCategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateTicketCategoryExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ticketCategoryId =
    req.params?.ticketCategoryId || req.body?.ticketCategoryId;

  if (ticketCategoryId) {
    const ticketCategory = await TicketCategoryRepository.getTicketCategoryById(
      Number(ticketCategoryId),
    );

    if (!ticketCategory) {
      res.status(404).json({
        error: [
          {
            path: "ticketCategoryId",
            msg: "We couldn't find this ticket category. Please recheck the ticket category ID",
          },
        ],
      });
      return;
    }

    next();
  } else next();
};

export default validateTicketCategoryExistence;
