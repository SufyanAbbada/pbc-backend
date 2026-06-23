import ProfileRepository from "../../repositories/ProfileRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateNonExistingProfile: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { user } = req.body;
  try {
    if (await ProfileRepository.getProfile(user.id)) {
      res.status(400).json({
        error: [
          {
            path: "userId",
            msg: "This user already has a profile. No need to create a new one",
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

export default validateNonExistingProfile;
