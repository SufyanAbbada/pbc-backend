import prisma from "../config/prismaClient";

class PushTokenRepository {
  async create(userId: number, token: string) {
    return prisma.pushToken.create({
      data: {
        token,
        userId,
      },
    });
  }

  async findTokensByUserId(userId: number) {
    return prisma.pushToken.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getAllTokens() {
    return prisma.pushToken.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async deleteToken(id: number) {
    return prisma.pushToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteTokensByUserId(userId: number) {
    return prisma.pushToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async findTokenByValue(token: string) {
    return prisma.pushToken.findFirst({
      where: {
        token,
      },
    });
  }

  async findTokenById(id: number) {
    return prisma.pushToken.findUnique({
      where: {
        id,
      },
    });
  }

  async findTokenByUserIdAndValue(userId: number, token: string) {
    return prisma.pushToken.findFirst({
      where: {
        userId,
        token,
      },
    });
  }
}

export default new PushTokenRepository();
