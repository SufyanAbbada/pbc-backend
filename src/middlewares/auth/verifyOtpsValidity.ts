import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// Please use this middleware after validateTempUserExistence middleware
const verifyOtpsValidity: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      user: { emailOtpExpiry, phoneOtpExpiry },
    } = req.body;

    if (
      new Date(emailOtpExpiry) >= new Date() &&
      new Date(phoneOtpExpiry) >= new Date()
    ) {
      res.status(400).json({
        error: [
          {
            path: "email, phoneNumber",
            msg: "Otps for email and phone number are still valid. Please use the existing OTPs to verify your account.",
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

export default verifyOtpsValidity;
