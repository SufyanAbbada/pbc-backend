import TempUserRepository from "../../repositories/TempUserRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const processExistingTempUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, phoneNumber } = req.body;
    const tempUser = await TempUserRepository.findTempUserByEmailOrPhone(
      email,
      phoneNumber,
    );

    if (tempUser) {
      if (tempUser.email === email && tempUser.phoneNumber === phoneNumber) {
        const emailValid = new Date(tempUser.emailOtpExpiry) >= new Date();
        const phoneValid = new Date(tempUser.phoneOtpExpiry) >= new Date();

        if (emailValid && phoneValid) {
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
      }

      await TempUserRepository.deleteTempUserById(Number(tempUser.id));
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default processExistingTempUser;
