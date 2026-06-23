import prisma from "../config/prismaClient";
import { Otp } from "../common/types";
import { TIME_STAMPS } from "../common/constants";

class OtpRepository {
  async createOtp(otpData: Otp) {
    return await prisma.otp.create({ data: otpData });
  }

  async findOtpById(userId: number) {
    return await prisma.otp.findFirst({
      where: {
        userId,
      },
    });
  }

  async deleteOtp(userId: number) {
    return await prisma.otp.delete({ where: { userId } });
  }

  async findOtpByUserId(userId: number) {
    return await prisma.otp.findUnique({ where: { userId } });
  }

  async updateOtpVerificationStatus(userId: number) {
    return await prisma.otp.update({
      where: {
        userId,
      },
      data: { isVerified: true },
    });
  }

  async deleteExpiredOtps() {
    return await prisma.otp.deleteMany({
      where: {
        expiresAt: {
          lte: new Date(
            Date.now() - TIME_STAMPS.RESET_PASSWORD_OTP_EXPIRE_TIME,
          ),
        },
      },
    });
  }
}

export default new OtpRepository();
