import OtpRepository from "../../repositories/OtpRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateOTPValidity: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user, resetOtp } = req.body;
    const userOtp = await OtpRepository.findOtpById(user.id);

    if (!userOtp) {
      res.status(404).json({
        error: [{ path: "resetOtp", msg: "User hasn't requested for OTP" }],
      });
      return;
    }

    if (userOtp.expiresAt < new Date()) {
      await OtpRepository.deleteOtp(Number(user.id));
      res.status(400).json({
        error: [
          {
            path: "resetOtp",
            msg: "The OTP has expired. Please request a new one and try again",
          },
        ],
      });
      return;
    }

    if (userOtp?.isVerified) {
      res.status(400).json({
        error: [
          { path: "resetOtp", msg: "This OTP has already been verified" },
        ],
      });
      return;
    }

    req.body.userOtp = resetOtp;
    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateOTPValidity;
