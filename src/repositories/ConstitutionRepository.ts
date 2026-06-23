import prisma from "../config/prismaClient";
import { Article, Constitution } from "../common/types";

class ConstitutionRepository {
  async getConstitution(includeArticles = true) {
    return await prisma.constitution.findFirst({
      include: {
        articles: includeArticles
          ? {
              orderBy: {
                id: "asc",
              },
            }
          : false,
      },
    });
  }

  async getLatestVersion() {
    return await prisma.constitution.findFirst({
      select: { version: true },
    });
  }

  async getArticleById(articleId: number) {
    return await prisma.article.findUnique({
      where: { id: articleId },
    });
  }

  async updateConstitution(data: Partial<Constitution>) {
    const constitution = await prisma.constitution.findFirst();

    return await prisma.constitution.update({
      where: { id: constitution?.id || 1 },
      data,
      include: {
        articles: true,
      },
    });
  }

  async updateArticle(articleId: number, data: Partial<Article>) {
    return await prisma.article.update({
      where: { id: articleId },
      data,
    });
  }
}

export default new ConstitutionRepository();
