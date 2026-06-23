import UserRepository from "../../repositories/UserRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateUserExistenceByEmail: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email } = req.body;
    const user = await UserRepository.findUserByEmail(email);

    if (!user) {
      res.status(404).json({
        error: [
          {
            path: "email",
            msg: "We couldn’t find a user with this email in the system",
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

export default validateUserExistenceByEmail;
