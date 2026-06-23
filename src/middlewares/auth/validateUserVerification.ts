import { NextFunction, Request, Response } from "express";
import UserRepository from "../../repositories/UserRepository";

const validateUserVerification = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { email } = req.body;

  const user = await UserRepository.findUserByEmail(email);

  if (!user?.isContactsVerfied) {
    res.status(403).json({
      error: [
        {
          path: "verification",
          msg: "Your account is not verified yet. Please verify both your email and phone number to proceed",
        },
      ],
    });
    return;
  }

  next();
};

export default validateUserVerification;
