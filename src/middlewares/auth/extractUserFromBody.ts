import { NextFunction, Request, Response } from "express";

// * This middleware must be used after the 'extractUserFromToken' middleware as it depends upon it.
const extractUserFromBody = (alias: string = "extractedUser") => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.body.user) {
      req.body[alias] = req.body.user;
    } else {
      res.status(400).json({
        error: [
          {
            path: "user",
            msg: "We couldn’t find the user in the request details. Please check and try again",
          },
        ],
      });
      return;
    }

    next();
  };
};

export default extractUserFromBody;
