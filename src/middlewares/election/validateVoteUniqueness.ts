import VoteRepository from "../../repositories/voteRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateVoteUniqueness = (): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { electionId, user } = req.body;

    const existingVote = await VoteRepository.getVoteByUserOnElection(
      Number(user.id),
      Number(electionId),
    );

    if (existingVote) {
      res.status(400).json({
        error: [
          {
            path: "vote",
            msg: "You have already casted your vote in this election.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateVoteUniqueness;
