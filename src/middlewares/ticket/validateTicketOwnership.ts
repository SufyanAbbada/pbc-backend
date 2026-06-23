import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware should only be placed after "validateTicketExistence" middleware as it depends upon it
const validateTicketOwnership: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, ticket } = req.body;

    if (Number(user.id) !== ticket?.userId) {
      res.status(403).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this ticket. User can only update/delete their own ticket.",
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

export default validateTicketOwnership;
