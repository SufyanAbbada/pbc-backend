import { Request, Response, NextFunction } from "express";

const validateOptionalFileUpload = (fieldName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    req.body[fieldName] = files[fieldName]?.[0]?.path || null;

    next();
  };
};

export default validateOptionalFileUpload;
