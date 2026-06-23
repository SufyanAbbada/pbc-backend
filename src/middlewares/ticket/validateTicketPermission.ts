import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware should only be placed after "validateTicketExistence" middleware as it depends upon it
const validateTicketPermission: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { ticket, user } = req.body;

    if (Number(ticket.userId) !== Number(user.id)) {
      res.status(403).json({
        error: [
          {
            path: "role",
            msg: "You don't have permission to interact with this ticket's responses.",
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

export default validateTicketPermission;
