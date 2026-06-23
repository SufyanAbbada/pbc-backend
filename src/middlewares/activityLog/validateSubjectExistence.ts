import UserRepository from "../../repositories/UserRepository";
import { Request, Response, NextFunction } from "express";
import { InteractionType } from "../../common/enums";

const validateInteractedUserExistence = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { interactionType, activityData, user } = req.body;

    const interactedUser =
      interactionType === InteractionType.EMAIL
        ? await UserRepository.findUserByEmail(activityData, false)
        : await UserRepository.findUserByPhoneNumber(activityData);

    if (!interactedUser) {
      res.status(404).json({
        error: [
          {
            path: "user",
            msg: "We couldn't find a user with the contact information you provided",
          },
        ],
      });
      return;
    }

    if (interactedUser.id === user.id) {
      res.status(403).json({
        error: [
          {
            path: "user",
            msg: "You cannot log an activity for your own contact information.",
          },
        ],
      });
      return;
    }

    req.body.interactedUser = interactedUser;

    next();
  } catch (error) {
    next(error);
  }
};

export default validateInteractedUserExistence;
