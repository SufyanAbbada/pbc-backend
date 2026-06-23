import { Request, Response, NextFunction } from "express";

const validateProductPictures = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files?.primaryImage?.[0]) {
    res.status(400).json({
      error: [
        {
          path: "primaryImage",
          msg: "The primary product picture is required. Please upload an image to proceed",
        },
      ],
    });
    return;
  }

  req.body.primaryImage = files.primaryImage[0].path;
  req.body.secondaryImage = files.secondaryImage?.[0]?.path || null;

  next();
};

export default validateProductPictures;
