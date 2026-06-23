import OtpRepository from "../../repositories/OtpRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateOtpVerification: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req.body;
    const userOtp = await OtpRepository.findOtpById(user.id);

    if (!userOtp) {
      res.status(404).json({
        error: [
          {
            path: "resetOtp",
            msg: "This user hasn't requested for an OTP yet",
          },
        ],
      });
      return;
    }

    if (!userOtp.isVerified) {
      res.status(400).json({
        error: [
          {
            path: "resetOtp",
            msg: "OTP has not been verified. Please verify the OTP before resetting the password.",
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

export default validateOtpVerification;
