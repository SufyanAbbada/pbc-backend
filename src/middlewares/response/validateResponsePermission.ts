import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware should only be placed after "validateResponseExistence" middleware as it depends upon it
const validateResponsePermission: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { response, user } = req.body;

    if (Number(response.userId) !== Number(user.id)) {
      res.status(403).json({
        error: [
          {
            path: "userId",
            msg: "You don't have permission to interact with this response.",
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

export default validateResponsePermission;
