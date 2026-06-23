import { Request, Response, NextFunction, RequestHandler } from "express";

const extractAndParseEventMedia: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const eventMedia = Object.keys(req.body)
    .filter((key) => key.startsWith("eventMedia") && req.body[key])
    .map((key) => ({ key, value: req.body[key] }));

  req.body.eventMedia = eventMedia;

  next();
};

export default extractAndParseEventMedia;
