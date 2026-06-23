import { Request, Response, NextFunction, RequestHandler } from "express";
import generalErrorResponse from "../../utils/generalErrorResponse";

const validateUserVerification = (field: string): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.body.user;

      if (!user || user[field] !== true) {
        res.status(403).json({
          error: [
            {
              path: "role",
              msg: `You are not authorized to perform this action. You need to verify your ${field === "isMembershipVerified" ? "Membership" : "Profile"} to access this privilege`,
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
};

export default validateUserVerification;
