import ProfileRepository from "../../repositories/ProfileRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateExistingProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      user: { id: userId },
    } = req.body;
    if (!(await ProfileRepository.getProfile(Number(userId)))) {
      res.status(404).json({
        error: [
          {
            path: "userId",
            msg: "We couldn't find a profile for this user",
          },
        ],
      });
      return;
    }
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }

  next();
};

export default validateExistingProfile;
