import { Request, Response, NextFunction } from "express";

const validateTicketImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files as
    | { [fieldname: string]: Express.Multer.File[] }
    | undefined;

  if (files) {
    req.body.primaryImage = files.primaryImage?.[0]?.path || null;
    req.body.secondaryImage = files.secondaryImage?.[0]?.path || null;
    req.body.tertiaryImage = files.tertiaryImage?.[0]?.path || null;
  }

  next();
};

export default validateTicketImages;
