import UserRepository from "../../repositories/UserRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateCandidateExistence = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { candidateIds } = req.body;

    if (!candidateIds) {
      next();
      return;
    }

    const invalidIds: number[] = [];

    for (const id of candidateIds) {
      const user = await UserRepository.getUserById(Number(id));
      if (!user) {
        invalidIds.push(id);
      }
    }

    if (invalidIds.length > 0) {
      res.status(404).json({
        error: [
          {
            path: "candidateIds",
            msg: `The following user(s) do not exist: ${invalidIds.join(", ")}. Please check the IDs and try again`,
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateCandidateExistence;
