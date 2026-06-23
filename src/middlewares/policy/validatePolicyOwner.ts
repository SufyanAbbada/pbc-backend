import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware should only be placed after policy existence middleware.
const validatePolicyOwner: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { policy, user } = req.body;

    if (Number(user.id) !== policy.userId) {
      res.status(400).json({
        error: [
          {
            path: "role",
            msg: "You are not authorized to update this Policy. User can only update/delete their own Policies",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validatePolicyOwner;
