import ElectionRepository from "../../repositories/electionRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validatePolicyDependency = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const policyId =
      source === SourceType.BODY ? req.body.policyId : req.params.policyId;

    const elections = await ElectionRepository.getElectionByPolicyId(
      Number(policyId),
    );

    if (elections.length > 0) {
      res.status(403).json({
        error: [
          {
            path: "policyId",
            msg: "You cannot delete this policy as it is associated with some elections.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validatePolicyDependency;
