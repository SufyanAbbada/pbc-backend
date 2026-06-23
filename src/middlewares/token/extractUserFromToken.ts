import UserRepository from "../../repositories/UserRepository";
import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../../utils/jwtHandler";

const extractUserFromToken = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { token } = req.headers;
  if (token && typeof token === "string") {
    const user = await UserRepository.getUserById(
      Number(verifyToken(token)?.userId),
    );
    if (user && user.isEnabled) req.body.user = user;
    else if (!user?.isEnabled) {
      res.status(403).json({
        error: [
          {
            path: "token",
            msg: "This user is disabled. Disabled users cannot access this route",
          },
        ],
      });
      return;
    } else {
      res.status(401).json({
        error: [
          {
            path: "token",
            msg: "The token is either invalid or has expired. Please request a new one and try again",
          },
        ],
      });
      return;
    }
  }
  next();
};

export default extractUserFromToken;
