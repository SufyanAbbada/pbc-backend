import UserRepository from "../../repositories/UserRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateUsersExistence: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userIds = req.body.userIds;

  const users = await UserRepository.getUserwithIds(userIds);

  if (users.length !== userIds.length) {
    res.status(404).json({
      error: [
        {
          path: "userIds",
          msg: "None of the users are valid. Please recheck the details",
        },
      ],
    });
    return;
  }

  next();
};

export default validateUsersExistence;
