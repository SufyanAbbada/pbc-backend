import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

// * This middleware needs to be placed after the article existence middleware.
const validateConstitutionEditability: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { constitution } = req.body;

    if (!constitution.isEditable) {
      res.status(403).json({
        error: [
          {
            path: "constitution",
            msg: "The constitution cannot be edited during the amendment phase with an ongoing election.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateConstitutionEditability;
