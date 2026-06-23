import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";

const validateAndParseDiscountValidity: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { startDate, validUntil } = req.body;

    const parsedStartDate = new Date(startDate);
    const parsedValidUntil = new Date(validUntil);
    if (parsedValidUntil <= parsedStartDate) {
      res.status(400).json({
        error: [
          {
            path: "validUntil",
            msg: "The 'valid until' date must be after the start date. Please choose a correct date",
          },
        ],
      });
      return;
    }

    //Plus 1 more day into validUntil date to validte Discount till 11:59
    parsedValidUntil.setDate(parsedValidUntil.getDate() + 1);
    req.body.startDate = parsedStartDate;
    req.body.validUntil = parsedValidUntil;

    next();
  } catch (error: any) {
    return generalErrorResponse(error, res);
  }
};

export default validateAndParseDiscountValidity;
