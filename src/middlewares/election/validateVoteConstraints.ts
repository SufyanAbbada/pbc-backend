import { Request, Response, NextFunction, RequestHandler } from "express";
import { ElectionType, PolicyVoteType } from "../../common/enums";

interface CandidateUser {
  id: number;
  name: string;
}

// * This middleware should only be placed after election existence middleware.
const validateVoteConstraints: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { vote, election } = req.body;

    if (election?.type === ElectionType.CANDIDATE_ELECTION) {
      const candidateIds =
        election.candidates?.map((c: CandidateUser) => c.id) || [];

      if (!candidateIds.includes(Number(vote))) {
        res.status(400).json({
          error: [
            {
              path: "vote",
              msg: "It looks like the candidate's user ID isn't part of this election",
            },
          ],
        });
        return;
      }
    }

    if (election?.type === ElectionType.POLICY_ELECTION) {
      if (![PolicyVoteType.DOWNVOTE, PolicyVoteType.UPVOTE].includes(vote)) {
        res.status(400).json({
          error: [
            {
              path: "vote",
              msg: 'Vote must be either "UPVOTE" or "DOWNVOTE" for a policy election.',
            },
          ],
        });
        return;
      }
    }

    if (election?.type === ElectionType.POLLING_ELECTION) {
      if (!election.pollOptions.includes(vote)) {
        res.status(400).json({
          error: [
            {
              path: "vote",
              msg: `It looks like the vote is invalid. Kindly select one of the following options: ${election.pollOptions.join(", ")}`,
            },
          ],
        });
        return;
      }
    }

    next();
  } catch (error) {
    res.status(400).json({
      error: [
        {
          path: "vote",
          msg: "Sorry, something went wrong while validating the vote. Please try again",
        },
      ],
    });
    return;
  }
};

export default validateVoteConstraints;
