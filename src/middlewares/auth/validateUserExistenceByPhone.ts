import UserRepository from "../../repositories/UserRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateUserExistenceByPhone: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { phoneNumber } = req.body;
    const user = await UserRepository.findUserByPhoneNumber(phoneNumber);

    if (!user) {
      res.status(404).json({
        error: [
          {
            path: "phoneNumber",
            msg: "We couldn’t find a user with this phone number in the system",
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

export default validateUserExistenceByPhone;
