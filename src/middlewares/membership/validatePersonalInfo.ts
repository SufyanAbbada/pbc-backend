import MembershipRegistrationRepository from "../../repositories/MembershipRegistrationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validatePersonalInfo: RequestHandler = async (
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

  if (!membershipRegistration?.personalInformation) {
    res.status(404).json({
      error: [
        {
          path: "personal-info",
          msg: "Personal information is required. Please complete your personal details before proceeding.",
        },
      ],
    });
    return;
  }

  next();
};

export default validatePersonalInfo;
