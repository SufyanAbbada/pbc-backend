import PolicyRepository from "../../repositories/policyRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validatePolicyExistence = (
  source: SourceType = SourceType.PARAM,
  optional: boolean = false,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const policyId =
      source === SourceType.BODY ? req.body.policyId : req.params.policyId;

    if (optional && !policyId) {
      return next();
    }

    const policy = await PolicyRepository.getPolicyById(Number(policyId));

    if (!policy) {
      res.status(404).json({
        error: [
          {
            path: "policyId",
            msg: "We couldn't find this policy in the system. Please recheck the policy ID",
          },
        ],
      });
      return;
    }

    req.body.policy = policy;

    next();
  };
};

export default validatePolicyExistence;
