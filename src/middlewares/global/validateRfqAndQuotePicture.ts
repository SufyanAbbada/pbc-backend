import { Request, Response, NextFunction } from "express";

const validateRfqPictures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  req.body.primaryImage = files?.primaryImage?.[0]?.path ?? null;
  req.body.secondaryImage = files?.secondaryImage?.[0]?.path ?? null;

  next();
};

export default validateRfqPictures;
