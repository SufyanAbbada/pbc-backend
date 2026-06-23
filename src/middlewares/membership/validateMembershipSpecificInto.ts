import MembershipRegistrationRepository from "../../repositories/MembershipRegistrationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateMembershipPreferences: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const {
    user: { id: userId },
  } = req.body;

  const membershipRegistration =
    await MembershipRegistrationRepository.getMembershipRegistration(
      Number(userId),
    );

  if (!membershipRegistration?.membershipPreferences) {
    res.status(404).json({
      error: [
        {
          path: "membership-specific-info",
          msg: "Membership Specific information is required. Please complete your membership preferences before proceeding.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateMembershipPreferences;
