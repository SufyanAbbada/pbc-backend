import UserRepository from "../../repositories/UserRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateMembershipExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user: { id: userId },
  } = req.body;
  const user = await UserRepository.getUserById(Number(userId));

  if (!user) {
    res.status(404).json({
      error: [
        {
          path: "userId",
          msg: "We couldn’t find this user in the system. Please recheck the user ID",
        },
      ],
    });
    return;
  }

  if (user.membership) {
    res.status(400).json({
      error: [{ path: "membership", msg: "User already has a membership" }],
    });
    return;
  }
  next();
};

export default validateMembershipExistence;
