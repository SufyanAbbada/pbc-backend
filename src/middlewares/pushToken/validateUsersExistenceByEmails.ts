import UserRepository from "../../repositories/UserRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateUsersExistenceByEmails: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { emails } = req.body;

  const users = await UserRepository.findUsersByEmails(emails);

  if (!users.length) {
    res.status(404).json({
      error: [
        {
          path: "emails",
          msg: "We couldn't find any users with the provided emails. Please recheck the emails",
        },
      ],
    });
    return;
  }

  req.body.users = users;
  next();
};

export default validateUsersExistenceByEmails;
