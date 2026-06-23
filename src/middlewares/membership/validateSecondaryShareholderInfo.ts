import MembershipRegistrationRepository from "../../repositories/MembershipRegistrationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateSecondaryShareholderInfo: RequestHandler = async (
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

  if (!membershipRegistration?.secondaryShareholderDetails) {
    res.status(404).json({
      error: [
        {
          path: "secondary-shareholder-info",
          msg: "Secondary shareholder information is required. Please complete the secondary shareholder details before proceeding.",
        },
      ],
    });
    return;
  }

  next();
};

export default validateSecondaryShareholderInfo;
