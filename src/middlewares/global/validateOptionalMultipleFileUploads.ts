import { Request, Response, NextFunction, RequestHandler } from "express";

const validateOptionalMultipleFileUploads = (
  fieldNames: string[],
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    fieldNames.forEach((fieldName) => {
      req.body[fieldName] = files?.[fieldName]?.[0]?.path || null;
    });

    next();
  };
};

export default validateOptionalMultipleFileUploads;
