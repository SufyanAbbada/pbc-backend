import pushTokenRepository from "../../repositories/pushTokenRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateTokenExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenValue =
        source === SourceType.BODY ? req.body.token : req.params.token;

      const token = await pushTokenRepository.findTokenByValue(tokenValue);

      if (!token) {
        res.status(404).json({
          error: [
            {
              path: "token",
              msg: "We couldn’t find the push token. Please provide a valid token and try again",
            },
          ],
        });
        return;
      }

      req.body.pushNotificationToken = token;
      next();
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  };
};

export default validateTokenExistence;
