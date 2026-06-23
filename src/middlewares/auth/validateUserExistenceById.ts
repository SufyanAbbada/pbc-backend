import UserRepository from "../../repositories/UserRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateUserExistenceById: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      user: { id: userId },
    } = req.body;
    const user = await UserRepository.getUserById(Number(userId));

    if (!user) {
      res.status(404).json({
        error: [
          {
            path: "userId",
            msg: "We couldn't find the user. Please recheck the User Info",
          },
        ],
      });
      return;
    }

    req.body.user = user;
    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateUserExistenceById;
