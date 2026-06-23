import OtpRepository from "../../repositories/OtpRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateExistingOTP: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user } = req.body;

    const userOtp = await OtpRepository.findOtpById(user.id);

    if (userOtp) {
      if (userOtp.expiresAt > new Date()) {
        res.status(409).json({
          error: [
            {
              path: "resetOtp",
              msg: "OTP for this user is already Present. Please use the previous one or try again after half an hour",
            },
          ],
        });
        return;
      } else {
        await OtpRepository.deleteOtp(Number(user.id));
      }
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateExistingOTP;
