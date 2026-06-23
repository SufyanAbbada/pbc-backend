import MembershipRegistrationRepository from "../../repositories/MembershipRegistrationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateBusinessInfo: RequestHandler = async (
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

  if (!membershipRegistration?.businessInformation) {
    res.status(404).json({
      error: [
        {
          path: "business-info",
          msg: "Business information is required. Please complete your business details before proceeding.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateBusinessInfo;
