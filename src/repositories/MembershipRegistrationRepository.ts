import prisma from "../config/prismaClient";
import { Prisma } from "@prisma/client";
import {
  PersonalInfo,
  BusinessInfo,
  PrimaryShareholderInfoData,
  SecondaryShareholderInfo,
  MembershipSpecificInfo,
  ProfessionalInfo,
} from "../common/types";

class MembershipRegistrationRepository {
  async addPersonalInfo(userId: number, personalInformation: PersonalInfo) {
    return await prisma.membershipRegistration.upsert({
      where: { userId },
      update: {
        personalInformation:
          personalInformation as unknown as Prisma.JsonObject,
      },
      create: {
        userId,
        personalInformation:
          personalInformation as unknown as Prisma.JsonObject,
      },
    });
  }

  async addBusinessInfo(userId: number, businessInformation: BusinessInfo) {
    return await prisma.membershipRegistration.update({
      where: { userId },
      data: {
        businessInformation:
          businessInformation as unknown as Prisma.JsonObject,
      },
    });
  }

  async addPrimaryShareholderInfo(
    userId: number,
    primaryShareholderDetails: PrimaryShareholderInfoData,
  ) {
    return await prisma.membershipRegistration.update({
      where: { userId },
      data: {
        primaryShareholderDetails:
          primaryShareholderDetails as unknown as Prisma.JsonObject,
      },
    });
  }

  async addMembershipSpecificInfo(
    userId: number,
    membershipPreferences: MembershipSpecificInfo,
  ) {
    return await prisma.membershipRegistration.update({
      where: { userId },
      data: {
        membershipPreferences:
          membershipPreferences as unknown as Prisma.JsonObject,
      },
    });
  }

  async addSecondaryShareholderInfo(
    userId: number,
    secondaryShareholderDetails: SecondaryShareholderInfo,
  ) {
    return await prisma.membershipRegistration.update({
      where: { userId },
      data: {
        secondaryShareholderDetails:
          secondaryShareholderDetails as unknown as Prisma.JsonObject,
      },
    });
  }

  async addProfessionalInfo(
    userId: number,
    professionalInformation: ProfessionalInfo,
  ) {
    return await prisma.membershipRegistration.update({
      where: { userId },
      data: {
        professionalInformation:
          professionalInformation as unknown as Prisma.JsonObject,
      },
    });
  }

  async getMembershipRegistration(userId: number) {
    return await prisma.membershipRegistration.findUnique({
      where: { userId },
    });
  }
}

export default new MembershipRegistrationRepository();
