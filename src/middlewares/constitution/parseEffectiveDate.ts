import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateandParseEffectiveDate: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { effectiveDate } = req.body;

    const parsedEffectiveDate = new Date(effectiveDate);

    if (
      isNaN(parsedEffectiveDate.getTime()) ||
      parsedEffectiveDate <= new Date()
    ) {
      res.status(400).json({
        error: [
          {
            path: "effectiveDate",
            msg: "'The 'effective date' must be a future date. Please choose a valid date",
          },
        ],
      });
      return;
    }

    req.body.effectiveDate = parsedEffectiveDate;

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateandParseEffectiveDate;
