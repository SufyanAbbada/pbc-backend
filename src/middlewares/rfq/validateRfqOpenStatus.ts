import generalErrorResponse from "../../utils/generalErrorResponse";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { RfqStatus } from "../../common/enums";

// * This middleware must be placed after "validateExistingRfq" or "validateExistingQuote" middleware as it depends upon it
const validateRfqOpenStatus: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { rfq } = req.body;

    if (rfq.status !== RfqStatus.OPEN) {
      res.status(400).json({
        error: [
          {
            path: "rfq",
            msg: "This RFQ is not open anymore. You cannot interact with closed/awarded RFQ.",
          },
        ],
      });
      return;
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateRfqOpenStatus;
