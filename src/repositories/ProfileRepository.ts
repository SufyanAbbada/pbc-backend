import prisma from "../config/prismaClient";
import { ProfileData } from "../common/types";
import { Prisma } from "@prisma/client";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class ProfileRepository {
  async createProfile(profileData: ProfileData) {
    return await prisma.profile.create({ data: profileData });
  }

  async getProfile(userId: number) {
    return await prisma.profile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phoneNumber: true,
            membership: true,
          },
        },
      },
    });
  }

  async updateProfile(userId: number, profileData: Partial<ProfileData>) {
    return await prisma.profile.update({
      where: { userId },
      data: profileData,
    });
  }

  async deleteProfile(id: number) {
    return await prisma.profile.delete({ where: { id } });
  }

  async searchProfiles(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.ProfileWhereInput = {
      OR: [
        { bio: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          country: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
        },
        {
          emiratesId: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          user: {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
        {
          user: {
            email: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
        },
      ],
    };

    const [profiles, totalCount] = await Promise.all([
      prisma.profile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true,
              phoneNumber: true,
            },
          },
        },
      }),
      prisma.profile.count({ where }),
    ]);

    return { profiles, totalCount };
  }
}

export default new ProfileRepository();
