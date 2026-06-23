import { Request, Response, NextFunction, RequestHandler } from "express";
import MembershipRepository from "../../repositories/membershipRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";

const validateExistingMembership: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (
      !(await MembershipRepository.getMembershipById(
        Number(req.params.membershipId),
      ))
    ) {
      res.status(404).json({
        error: [
          {
            path: "membershipId",
            msg: "We couldn’t find the membership. Please recheck the membership ID",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateExistingMembership;
