import UserRepository from "../../repositories/UserRepository";
import { RequestHandler, Request, Response, NextFunction } from "express";
import generalErrorResponse from "../../utils/generalErrorResponse";

const validateUserUniqueness: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, phoneNumber } = req.body;
    if (
      (await UserRepository.findUserByEmail(email)) ||
      (await UserRepository.findUserByPhoneNumber(phoneNumber))
    ) {
      res.status(409).json({
        error: [
          {
            path: "email, phoneNumber",
            msg: "Email and Phone Number must be unique. User with the provided email or Phone Number already exists",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateUserUniqueness;
