import { Request, Response, NextFunction } from "express";
import { InteractionType } from "../../common/enums";

const validateContactInfoExistence = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, phoneNumber } = req.body;

    if (!email && !phoneNumber) {
      res.status(400).json({
        error: [
          {
            path: "email/phoneNumber",
            msg: "Please provide either an email address or a phone number to continue",
          },
        ],
      });
      return;
    }

    if (email) {
      req.body.interactionType = InteractionType.EMAIL;
      req.body.activityData = email;
    } else {
      req.body.interactionType = InteractionType.PHONE;
      req.body.activityData = phoneNumber;
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default validateContactInfoExistence;
