import prisma from "../config/prismaClient";
import { BasicUser } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { MembershipCategory, RoleId } from "../common/enums";
import { Prisma } from "@prisma/client";

class UserRepository {
  async createUser(userData: BasicUser) {
    return await prisma.user.create({
      data: userData,
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  async findUserByEmail(email: string, includeRelations = true) {
    return await prisma.user.findUnique({
      where: { email },
      ...(includeRelations && { include: { membership: true } }),
    });
  }

  async findUsersByEmails(emails: string[]) {
    return await prisma.user.findMany({
      where: { email: { in: emails } },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  async findUserByPhoneNumber(phoneNumber: string) {
    return await prisma.user.findUnique({ where: { phoneNumber } });
  }

  async findUsersByMembershipCategoryType(
    membershipCategory: MembershipCategory,
    page?: number,
    limit?: number,
    roleIds?: RoleId[],
  ) {
    const skip = calculatePaginationSkip(page, limit);
    const [users, totalCount] = await Promise.all([
      await prisma.user.findMany({
        where: {
          membership: {
            membershipCategory,
          },
          roleId: { in: roleIds },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
        skip,
        take: limit,
      }),
      await prisma.user.count({
        where: {
          membership: {
            membershipCategory,
          },
        },
      }),
    ]);
    return { users, totalCount };
  }

  async getAllUsers(
    page?: number,
    limit?: number,
    status?: boolean,
    roleIds?: RoleId[],
    searchTerm?: string,
  ) {
    const skip = calculatePaginationSkip(page, limit);
    const whereClause = {
      ...(typeof status === "boolean" && { isActive: status }),
      ...(roleIds && { roleId: { in: roleIds } }),
      ...(searchTerm && {
        OR: [
          {
            name: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
          {
            email: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
          },
          {
            phoneNumber: {
              contains: searchTerm,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
        include: {
          Role: true,
        },
      }),
      prisma.user.count({
        where: whereClause,
      }),
    ]);
    return { users, totalCount };
  }

  async getUserById(id: number) {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isContactsVerfied: true,
        isMembershipVerified: true,
        isProfileVerified: true,
        isActive: true,
        isEnabled: true,
        Role: {
          select: {
            id: true,
            name: true,
            permissions: {
              select: { action: true, subject: true, permission: true },
            },
          },
        },
        membership: {
          select: {
            status: true,
            membershipCategory: true,
          },
        },
        profile: true,
      },
    });
  }

  getUserwithIds(userIds: number[]) {
    return prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true },
    });
  }

  async getUserDetails(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async getUsersAssignedToEvent(eventId: number) {
    return await prisma.user.findMany({
      where: {
        EventAssignee: {
          some: {
            eventId,
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  async updateUserPassword(id: number, userPassword: string) {
    return await prisma.user.update({
      where: { id },
      data: { password: userPassword },
    });
  }

  async updateUserStatus(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { isActive: true, isEnabled: true },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isActive: true,
        isEnabled: true,
      },
    });
  }

  async updateUserMembership(id: number, membershipId: number) {
    return await prisma.user.update({
      where: { id },
      data: { membership: { connect: { id: membershipId } } },
    });
  }

  async updateUserProfileVerification(id: number, status: boolean) {
    return await prisma.user.update({
      where: { id },
      data: { isProfileVerified: true },
    });
  }

  async updateUserMembershipVerification(id: number, status: boolean) {
    return await prisma.user.update({
      where: { id },
      data: { isMembershipVerified: status },
    });
  }

  async updateName(userId: number, name: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { name },
    });
  }

  async deleteUser(userId: number) {
    return await prisma.user.delete({
      where: { id: userId },
    });
  }

  async deactivateUser(id: number) {
    return await prisma.user.update({
      where: { id },
      data: { isDeleted: true },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });
  }

  async updateUserActivation(id: number, isEnabled: boolean) {
    return await prisma.user.update({
      where: { id },
      data: { isEnabled },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
        isEnabled: true,
      },
    });
  }
}

export default new UserRepository();
