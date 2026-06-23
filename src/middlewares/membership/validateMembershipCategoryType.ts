import { MembershipCategory } from "../../common/enums";
import { Request, Response, NextFunction, RequestHandler } from "express";

// * This middleware must be used after the user has been extracted from the token
const validateMembershipCategoryType = (
  membershipCategory: MembershipCategory,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req.body;

    if (user.membership.membershipCategory !== membershipCategory) {
      res.status(403).json({
        error: [
          {
            path: "membershipCategory",
            msg: "The type of your membership is not authorized to perform this action.",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default validateMembershipCategoryType;
