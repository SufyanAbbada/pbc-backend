import ProfileRepository from "../repositories/ProfileRepository";
import UserRepository from "../repositories/UserRepository";
import S3Service from "../services/s3Service";
import generalErrorResponse from "../utils/generalErrorResponse";
import { prependProtocol } from "../utils/prependProtocol";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";

class ProfileController {
  async getMyProfile(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;

      const userProfile = await ProfileRepository.getProfile(Number(userId));

      return res.status(200).json({
        message: "User Profile fetched successfully",
        data: userProfile,
      });
    } catch (err: any) {
      return generalErrorResponse(err, res);
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      const userProfile = await ProfileRepository.getProfile(Number(userId));

      if (!userProfile) {
        return res.status(404).json({
          error: [
            {
              path: "userId",
              msg: "We couldn't find a profile with the User ID you provided. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "User Profile fetched successfully",
        data: userProfile,
      });
    } catch (err: any) {
      return generalErrorResponse(err, res);
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      let {
        bio,
        bioVideo,
        country,
        facebookSocial,
        linkedInSocial,
        calendlyLink,
        profilePicture,
        latitude,
        longitude,
        tradeLicense,
        passport,
        emiratesId,
        name,
        user: { id: userId },
      } = req.body;

      const profilePictureURL = profilePicture
        ? await S3Service.uploadAsset(profilePicture)
        : undefined;

      const tradeLicenseURL = tradeLicense
        ? await S3Service.uploadAsset(tradeLicense)
        : undefined;

      const passportURL = passport
        ? await S3Service.uploadAsset(passport)
        : undefined;

      const emiratesIdURL = emiratesId
        ? await S3Service.uploadAsset(emiratesId)
        : undefined;

      const bioVideoURL = bioVideo
        ? await S3Service.uploadAsset(bioVideo)
        : undefined;

      await UserRepository.updateName(Number(userId), name);

      facebookSocial = prependProtocol(facebookSocial);
      linkedInSocial = prependProtocol(linkedInSocial);
      calendlyLink = prependProtocol(calendlyLink);

      const updatedProfile = await ProfileRepository.updateProfile(
        Number(userId),
        {
          userId: Number(userId),
          bio,
          country,
          profilePicture: profilePictureURL,
          tradeLicense: tradeLicenseURL,
          passport: passportURL,
          emiratesId: emiratesIdURL,
          bioVideo: bioVideoURL,
          facebookSocial,
          linkedInSocial,
          calendlyLink,
          latitude,
          longitude,
        },
      );

      return res.status(200).json({
        message: "Profile updated successfully",
        data: updatedProfile,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async addProfile(req: Request, res: Response) {
    try {
      let {
        bio,
        bioVideo,
        country,
        facebookSocial,
        linkedInSocial,
        calendlyLink,
        profilePicture,
        latitude,
        longitude,
        tradeLicense,
        passport,
        emiratesId,
        user: { id: userId },
      } = req.body;

      const profilePictureURL = profilePicture
        ? await S3Service.uploadAsset(profilePicture)
        : undefined;

      const bioVideoURL = await S3Service.uploadAsset(bioVideo);
      const tradeLicenseURL = await S3Service.uploadAsset(tradeLicense);
      const passportURL = await S3Service.uploadAsset(passport);
      const emiratesIdURL = await S3Service.uploadAsset(emiratesId);

      facebookSocial = prependProtocol(facebookSocial);
      linkedInSocial = prependProtocol(linkedInSocial);
      calendlyLink = prependProtocol(calendlyLink);

      const newProfile = await ProfileRepository.createProfile({
        userId: Number(userId),
        bio: bio,
        country,
        profilePicture: profilePictureURL,
        tradeLicense: tradeLicenseURL,
        passport: passportURL,
        emiratesId: emiratesIdURL,
        bioVideo: bioVideoURL,
        facebookSocial,
        linkedInSocial,
        calendlyLink,
        latitude,
        longitude,
      });

      await UserRepository.updateUserProfileVerification(Number(userId), true);

      return res.status(200).json({
        message: "Profile updated successfully",
        data: newProfile,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async searchProfiles(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { profiles, totalCount } = await ProfileRepository.searchProfiles(
        search as string,
        page,
        limit,
      );

      const response = {
        message: "Search results for profiles fetched successfully",
        data: profiles,
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
}

export default new ProfileController();
