import ConstitutionRepository from "../../repositories/ConstitutionRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateArticleExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const articleId =
        source === SourceType.BODY ? req.body.articleId : req.params.articleId;

      const article = await ConstitutionRepository.getArticleById(
        Number(articleId),
      );

      if (!article) {
        res.status(404).json({
          error: [
            {
              path: "articleId",
              msg: "We couldn't find this article in the system. Please recheck and try again",
            },
          ],
        });
        return;
      }

      req.body.constitution =
        await ConstitutionRepository.getConstitution(false);
      req.body.article = article;

      next();
    } catch (error) {
      generalErrorResponse(error, res);
    }
  };
};

export default validateArticleExistence;
