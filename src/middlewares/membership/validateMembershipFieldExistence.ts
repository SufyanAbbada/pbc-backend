import membershipRepository from "../../repositories/membershipRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { MembershipType } from "../../common/types";

const validateMembershipFieldExistence = (
  field: keyof MembershipType,
  label: string,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const fieldValue = req.body[field];

    const membershipRegistration =
      await membershipRepository.getMembershipByColumn(field, fieldValue);

    if (membershipRegistration) {
      res.status(403).json({
        error: [
          {
            path: `${field}`,
            msg: `${label} already exists and must be unique. Please use a different value for ${label}.`,
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateMembershipFieldExistence;
