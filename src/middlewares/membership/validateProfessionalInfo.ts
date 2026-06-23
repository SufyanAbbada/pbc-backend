import MembershipRegistrationRepository from "../../repositories/MembershipRegistrationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateProfessionalInfo: RequestHandler = async (
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

  if (!membershipRegistration?.professionalInformation) {
    res.status(404).json({
      error: [
        {
          path: "professional-info",
          msg: "Professional information is required. Please complete your professional details before proceeding.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateProfessionalInfo;
