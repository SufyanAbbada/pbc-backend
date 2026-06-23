import MembershipRepository from "../repositories/membershipRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import subscriptionController from "./subscriptionController";
import {
  PersonalInfo,
  BusinessInfo,
  PrimaryShareholderInfoData,
  SecondaryShareholderInfo,
  ProfessionalInfo,
  MembershipSpecificInfo,
  MembershipType,
  PaginationResponse,
} from "../common/types";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";

class MembershipController {
  async createNewMembership(req: Request, res: Response) {
    try {
      const { membershipRegistration } = req.body;

      const personalInfo: PersonalInfo = {
        emiratesId: membershipRegistration.personalInformation.emiratesId,
        dateOfBirth: membershipRegistration.personalInformation.dateOfBirth,
        passportNumber:
          membershipRegistration.personalInformation.passportNumber,
        passportExpiryDate:
          membershipRegistration.personalInformation.passportExpiryDate,
        emiratesIdExpiryDate:
          membershipRegistration.personalInformation.emiratesIdExpiryDate,
        mailingAddress:
          membershipRegistration.personalInformation.mailingAddress,
      };

      const businessInfo: BusinessInfo = {
        companyName: membershipRegistration.businessInformation.companyName,
        city: membershipRegistration.businessInformation.city,
        country: membershipRegistration.businessInformation.country,
        tradeLicenseNumber:
          membershipRegistration.businessInformation.tradeLicenseNumber,
        yearOfEstablishment: Number(
          membershipRegistration.businessInformation.yearOfEstablishment,
        ),
        affiliation: membershipRegistration.businessInformation.affiliation,
        legalStatus: membershipRegistration.businessInformation.legalStatus,
        natureOfBusiness:
          membershipRegistration.businessInformation.natureOfBusiness,
        businessGroup: membershipRegistration.businessInformation.businessGroup,
        keywords: membershipRegistration.businessInformation.keywords,
        hsCodes: membershipRegistration.businessInformation.hsCodes,
        website: membershipRegistration.businessInformation.website,
        noOfEmployees: Number(
          membershipRegistration.businessInformation.noOfEmployees,
        ),
        vatRegistrationNumber:
          membershipRegistration.businessInformation.vatRegistrationNumber,
        tradeLicenseExpiry:
          membershipRegistration.businessInformation.tradeLicenseExpiry,
        emiratesIssuingAuthority:
          membershipRegistration.businessInformation.emiratesIssuingAuthority,
      };

      const primaryShareholder: PrimaryShareholderInfoData = {
        annualRevenue:
          membershipRegistration.primaryShareholderDetails.annualRevenue,
        shareHolderStatus:
          membershipRegistration.primaryShareholderDetails.shareHolderStatus,
        ownershipPercentage: Number(
          membershipRegistration.primaryShareholderDetails.ownershipPercentage,
        ),
        otherShareHoldersName:
          membershipRegistration.primaryShareholderDetails
            .otherShareHoldersName,
      };

      const secondaryShareholder: SecondaryShareholderInfo = {
        references:
          membershipRegistration.secondaryShareholderDetails.references,
      };

      const professionalInfo: ProfessionalInfo = {
        primeClients:
          membershipRegistration.professionalInformation.primeClients,
        languagesSpoken:
          membershipRegistration.professionalInformation.languagesSpoken,
        professionalTitle:
          membershipRegistration.professionalInformation.professionalTitle,
        yearsOfExperience: Number(
          membershipRegistration.professionalInformation.yearsOfExperience,
        ),
      };

      const membershipSpecificInfo: MembershipSpecificInfo = {
        keyObjectives:
          membershipRegistration.membershipPreferences.keyObjectives,
        areaOfInterest:
          membershipRegistration.membershipPreferences.areaOfInterest,
        selfDescription:
          membershipRegistration.membershipPreferences.selfDescription,
        membershipCategory:
          membershipRegistration.membershipPreferences.membershipCategory,
        councilDiscoveryMethod:
          membershipRegistration.membershipPreferences.councilDiscoveryMethod,
        expectations: membershipRegistration.membershipPreferences.expectations,
        businessTrainingInterest:
          membershipRegistration.membershipPreferences.businessTrainingInterest,
        clientIntroductionComfort:
          membershipRegistration.membershipPreferences
            .clientIntroductionComfort,
      };

      const membershipData: MembershipType = {
        userId: Number(membershipRegistration.userId),
        ...personalInfo,
        ...businessInfo,
        ...primaryShareholder,
        ...secondaryShareholder,
        ...professionalInfo,
        ...membershipSpecificInfo,
      };

      await MembershipRepository.createNewMembership(membershipData);

      await subscriptionController.createSubscription(req, res);
    } catch (error: any) {
      throw error;
    }
  }

  async getMyMembership(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const membershipData = await MembershipRepository.getMembershipByUserId(
        Number(userId),
      );

      if (!membershipData)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn’t find your membership in the system. Please double-check your details and try again",
            },
          ],
        });

      return res.status(200).json({
        message: "Membership Temp Data Retrieved Successfully",
        data: membershipData,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getUserMembership(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const membershipData = await MembershipRepository.getMembershipByUserId(
        Number(userId),
      );

      if (!membershipData)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn’t find your membership in the system. Please double-check your details and try again.",
            },
          ],
        });

      return res.status(200).json({
        message: "Membership Temp Data Retrieved Successfully",
        data: membershipData,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMembershipById(req: Request, res: Response) {
    try {
      const { membershipId } = req.params;

      const membershipData = await MembershipRepository.getMembershipById(
        Number(membershipId),
      );

      if (!membershipData)
        return res.status(404).json({
          error: [
            {
              path: "membershipId",
              msg: "We couldn’t find your membership in the system. Please double-check your details and try again.",
            },
          ],
        });

      return res.status(200).json({
        message: "Membership Temp Data Retrieved Successfully",
        data: membershipData,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllMembership(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { memberships, totalCount } =
        await MembershipRepository.getAllMemberships(page, limit);

      const response: PaginationResponse = {
        message: "Memberships fetched successfully",
        data: memberships,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateMembershipStatus(req: Request, res: Response) {
    const { membershipId } = req.params;
    const { status } = req.body;

    try {
      const updatedMembership =
        await MembershipRepository.updateMembershipStatus(
          Number(membershipId),
          status,
        );

      return res.status(202).json({
        message: "Membership status updated successfully",
        data: updatedMembership,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new MembershipController();
