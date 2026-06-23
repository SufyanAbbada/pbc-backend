import pushTokenRepository from "../../repositories/pushTokenRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware must be placed after the user is extracted from the token
const validateDuplicateTokens: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, user } = req.body;

    const existingToken = await pushTokenRepository.findTokenByUserIdAndValue(
      user.id,
      token,
    );

    if (existingToken) {
      req.body.pushNotificationToken = existingToken;
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateDuplicateTokens;
