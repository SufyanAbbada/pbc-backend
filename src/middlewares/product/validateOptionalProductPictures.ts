import { Request, Response, NextFunction } from "express";

const validateOptionalProductPictures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (files?.primaryImage?.[0]) {
    req.body.primaryImage = files.primaryImage[0].path;
  }
  if (files?.secondaryImage?.[0]) {
    req.body.secondaryImage = files.secondaryImage[0].path;
  }

  next();
};

export default validateOptionalProductPictures;
