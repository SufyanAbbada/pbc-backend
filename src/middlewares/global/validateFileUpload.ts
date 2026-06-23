import { Request, Response, NextFunction } from "express";

const validateFileUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [key: string]: Express.Multer.File[] };

    if (!files?.[fieldName]?.[0]) {
      res.status(400).json({
        error: [
          {
            path: fieldName,
            msg: `Please upload the ‘${fieldName}’ file. It’s required to proceed`,
          },
        ],
      });
      return;
    }

    req.body[fieldName] = files[fieldName][0].path;
    next();
  };
};

export default validateFileUpload;
