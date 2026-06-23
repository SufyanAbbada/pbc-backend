import { NextFunction, Request, Response } from "express";

const validateVerifiedUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // * This middleware should only be placed after "extractUserFromToken" middleware as it depends on it
  const { user } = req.body;

  if (user?.isContactsVerfied) {
    res.status(403).json({
      error: [
        {
          path: "verification",
          msg: "Your account has already been verified. There’s no need to verify again",
        },
      ],
    });
    return;
  }

  next();
};

export default validateVerifiedUser;
