import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "superSecretKey";
const EXPIRES_IN = "24h";

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: EXPIRES_IN });
};

export const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      throw new Error(
        "Your session has expired. Please sign in again to continue.",
      );
    } else if (error.name === "JsonWebTokenError") {
      throw new Error(
        "We couldn't verify your session. Please check your login and try again.",
      );
    } else {
      throw new Error(
        "Something went wrong while verifying your session or jwt token. Please try again.",
      );
    }
  }
};
