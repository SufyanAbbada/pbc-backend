import MembershipRegistrationRepository from "../repositories/MembershipRegistrationRepository";
import UserRepository from "../repositories/UserRepository";
import membershipController from "./membershipController";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { sendEmail } from "../services/twilioService";
import { membershipRegistrationTemplate } from "../templates/membershipTemplates";
import { MANAGEMENT_ROLES } from "../common/constants";
import { prependProtocol } from "../utils/prependProtocol";

class MembershipRegistrationController {
  async createPersonalInfo(req: Request, res: Response) {
    try {
      const {
        dateOfBirth,
        passportNumber,
        passportExpiryDate,
        emiratesId,
        emiratesIdExpiryDate,
        mailingAddress,
        user: { id: userId, email, name },
      } = req.body;

      const personalInfoData = {
        dateOfBirth,
        passportNumber,
        passportExpiryDate,
        emiratesId,
        emiratesIdExpiryDate,
        mailingAddress,
      };

      const updateMembershipRegistration =
        await MembershipRegistrationRepository.addPersonalInfo(
          Number(userId),
          personalInfoData,
        );

      const { users } = await UserRepository.getAllUsers(
        undefined,
        undefined,
        undefined,
        MANAGEMENT_ROLES,
      );

      const emailPromises = users.map((user) =>
        sendEmail(
          user.email,
          "New Membership Registration",
          membershipRegistrationTemplate(
            user.name,
            name,
            email,
            new Date(updateMembershipRegistration.createdAt),
          ),
        ),
      );

      await Promise.all(emailPromises);

      return res.status(201).json({
        message: "PersonalInfo Created Successfully",
        data: updateMembershipRegistration,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async createBusinessInfo(req: Request, res: Response) {
    try {
      let {
        companyName,
        city,
        country,
        tradeLicenseNumber,
        yearOfEstablishment,
        affiliation,
        legalStatus,
        natureOfBusiness,
        businessGroup,
        keywords,
        website,
        hsCodes,
        noOfEmployees,
        vatRegistrationNumber,
        tradeLicenseExpiry,
        emiratesIssuingAuthority,
        user: { id: userId },
      } = req.body;

      website = prependProtocol(website);

      const businessInfoData = {
        companyName,
        city,
        country,
        tradeLicenseNumber,
        yearOfEstablishment,
        affiliation,
        legalStatus,
        natureOfBusiness,
        businessGroup,
        keywords,
        website,
        hsCodes,
        noOfEmployees,
        vatRegistrationNumber,
        tradeLicenseExpiry,
        emiratesIssuingAuthority,
      };

      const updateMembershipRegistration =
        await MembershipRegistrationRepository.addBusinessInfo(
          Number(userId),
          businessInfoData,
        );

      return res.status(201).json({
        message: "BusinessInfo Created Successfully",
        data: updateMembershipRegistration,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async createPrimaryShareholderInfo(req: Request, res: Response) {
    try {
      const {
        shareHolderStatus,
        otherShareHoldersName,
        annualRevenue,
        ownershipPercentage,
        user: { id: userId },
      } = req.body;

      const primaryShareholderInfoData = {
        shareHolderStatus,
        otherShareHoldersName,
        annualRevenue,
        ownershipPercentage,
      };

      const updateMembershipRegistration =
        await MembershipRegistrationRepository.addPrimaryShareholderInfo(
          Number(userId),
          primaryShareholderInfoData,
        );

      return res.status(201).json({
        message: "Shareholder Information Created Successfully",
        data: updateMembershipRegistration,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async membershipSpecificInfo(req: Request, res: Response) {
    try {
      const {
        keyObjectives,
        areaOfInterest,
        expectations,
        selfDescription,
        clientIntroductionComfort,
        businessTrainingInterest,
        councilDiscoveryMethod,
        membershipCategory,
        user: { id: userId },
      } = req.body;

      const membershipSpecificInfoData = {
        keyObjectives,
        areaOfInterest,
        expectations,
        selfDescription,
        clientIntroductionComfort,
        businessTrainingInterest,
        councilDiscoveryMethod,
        membershipCategory,
      };

      const updateMembershipRegistration =
        await MembershipRegistrationRepository.addMembershipSpecificInfo(
          Number(userId),
          membershipSpecificInfoData,
        );

      return res.status(201).json({
        message: "Membership Specific Data Created Successfully",
        data: updateMembershipRegistration,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async createSecondaryShareholderInfo(req: Request, res: Response) {
    try {
      const {
        references,
        user: { id: userId },
      } = req.body;

      const secondaryShareholderInfo = {
        references,
      };

      const updateMembershipRegistration =
        await MembershipRegistrationRepository.addSecondaryShareholderInfo(
          Number(userId),
          secondaryShareholderInfo,
        );
      req.body.membershipRegistration = updateMembershipRegistration;

      await membershipController.createNewMembership(req, res);

      return res.status(201).json({
        message: "Secondary Shareholder Info Created Successfully",
        data: updateMembershipRegistration,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async createProfessionalInfo(req: Request, res: Response) {
    try {
      const {
        professionalTitle,
        yearsOfExperience,
        languagesSpoken,
        primeClients,
        user: { id: userId },
      } = req.body;

      const professionalInfoData = {
        professionalTitle,
        yearsOfExperience,
        languagesSpoken,
        primeClients: primeClients,
      };

      const updateMembershipRegistration =
        await MembershipRegistrationRepository.addProfessionalInfo(
          Number(userId),
          professionalInfoData,
        );

      return res.status(201).json({
        message: "Professional Information Created Successfully",
        data: updateMembershipRegistration,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
  async getMyMembershipRegistration(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const membershipRegistrationData =
        await MembershipRegistrationRepository.getMembershipRegistration(
          Number(userId),
        );
      if (!membershipRegistrationData)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find your membership registration in the system. Please make sure the details are correct",
            },
          ],
        });

      return res.status(200).json({
        message: "Membership Registration Data Fetched Successfully",
        data: membershipRegistrationData,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getUserMembershipRegistration(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const membershipRegistrationData =
        await MembershipRegistrationRepository.getMembershipRegistration(
          Number(userId),
        );
      if (!membershipRegistrationData)
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find your membership registration in the system. Please make sure the details are correct",
            },
          ],
        });

      return res.status(200).json({
        message: "Membership Registration Data Fetched Successfully",
        data: membershipRegistrationData,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new MembershipRegistrationController();
