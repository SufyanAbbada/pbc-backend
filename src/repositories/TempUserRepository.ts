import prisma from "../config/prismaClient";
import { TempUser } from "../common/types";
import { TIME_STAMPS } from "../common/constants";

class TempUserRepository {
  async createTempUser(userData: TempUser) {
    return await prisma.temporaryUser.create({
      data: userData,
    });
  }

  async findTempUserByEmail(email: string) {
    return await prisma.temporaryUser.findUnique({
      where: { email },
    });
  }

  async findTempUserByPhoneNumber(phoneNumber: string) {
    return await prisma.temporaryUser.findUnique({ where: { phoneNumber } });
  }

  async findTempUserByEmailOrPhone(email: string, phoneNumber: string) {
    return await prisma.temporaryUser.findFirst({
      where: {
        OR: [{ email }, { phoneNumber }],
      },
    });
  }

  async findTempUserByEmailAndPhone(email: string, phoneNumber: string) {
    return await prisma.temporaryUser.findFirst({
      where: {
        AND: [{ email }, { phoneNumber }],
      },
    });
  }

  async getTempUserById(id: number) {
    return await prisma.temporaryUser.findUnique({
      where: { id },
    });
  }

  async deleteTempUserById(id: number) {
    return await prisma.temporaryUser.delete({
      where: { id },
    });
  }

  async updateTempUserOtpsValidity(userId: number) {
    return await prisma.temporaryUser.update({
      where: { id: userId },
      data: {
        emailOtpExpiry: new Date(
          Date.now() + TIME_STAMPS.EMAIL_VERIFICATION_OTP_EXPIRE_TIME,
        ),
        phoneOtpExpiry: new Date(
          Date.now() + TIME_STAMPS.PHONE_VERIFICATION_OTP_EXPIRE_TIME,
        ),
      },
    });
  }

  async updateTempEmailVerificationStatus(userId: number) {
    return await prisma.temporaryUser.update({
      where: { id: userId },
      data: { isEmailVerified: true },
    });
  }

  async updateTempPhoneVerificationStatus(userId: number) {
    return await prisma.temporaryUser.update({
      where: { id: userId },
      data: { isPhoneVerified: true },
    });
  }

  async deleteExpiredTempUsers() {
    const bufferTime = new Date();
    bufferTime.setMinutes(bufferTime.getMinutes() + 30);

    return await prisma.temporaryUser.deleteMany({
      where: {
        OR: [
          { emailOtpExpiry: { gte: bufferTime } },
          { phoneOtpExpiry: { gte: bufferTime } },
        ],
      },
    });
  }
}

export default new TempUserRepository();
