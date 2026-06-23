import TicketCategoryRepository from "../../repositories/TicketCategoryRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateTicketCategoryUniqueness: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { name } = req.body;

  const existingTicketCategory =
    await TicketCategoryRepository.getTicketCategoryByName(name);

  if (existingTicketCategory) {
    res.status(400).json({
      error: [
        {
          path: "name",
          msg: "This ticket category name already exists. Please choose a different and unique name",
        },
      ],
    });
    return;
  }

  next();
};

export default validateTicketCategoryUniqueness;
