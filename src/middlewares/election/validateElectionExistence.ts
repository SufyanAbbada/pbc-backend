import ElectionRepository from "../../repositories/electionRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateElectionExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const electionId =
      source === SourceType.BODY ? req.body.electionId : req.params.electionId;

    const election = await ElectionRepository.getElectionById(
      Number(electionId),
    );

    if (!election) {
      res.status(404).json({
        error: [
          {
            path: "electionId",
            msg: "We couldn't find this election in the system. Please recheck the election ID",
          },
        ],
      });
      return;
    }

    req.body.election = election;

    next();
  };
};

export default validateElectionExistence;
