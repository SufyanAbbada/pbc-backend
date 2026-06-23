import { Request, Response, NextFunction } from "express";

const validateTransactionDocs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const { primaryImage, secondaryImage } = req.body;

  if (!primaryImage) {
    res.status(400).json({
      error: [
        {
          path: "primaryImage",
          msg: "The 'primaryImage' file is required. Please upload the image to proceed",
        },
      ],
    });
  }

  req.body.primaryImage = files?.primaryImage?.[0]?.path ?? primaryImage;
  req.body.secondaryImage = files?.secondaryImage?.[0]?.path ?? secondaryImage;

  next();
};

export default validateTransactionDocs;
