import MembershipRegistrationRepository from "../../repositories/MembershipRegistrationRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validatePrimaryShareholderInfo: RequestHandler = async (
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

  if (!membershipRegistration?.primaryShareholderDetails) {
    res.status(404).json({
      error: [
        {
          path: "primary-shareholder-info",
          msg: "Primary shareholder information is required. Please complete the primary shareholder details before proceeding.",
        },
      ],
    });
    return;
  }

  next();
};

export default validatePrimaryShareholderInfo;
