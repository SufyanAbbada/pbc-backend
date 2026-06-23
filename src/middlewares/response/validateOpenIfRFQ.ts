import ResponseRepository from "../../repositories/ResponseRepository";
import RfqRepository from "../../repositories/RfqRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { RfqStatus } from "../../common/enums";
import { Request, Response, NextFunction, RequestHandler } from "express";

const validateOpenIfRFQ: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { responseId } = req.params;

    const response = await ResponseRepository.getResponseById(
      Number(responseId),
    );

    if (response?.quoteId) {
      const rfq = await RfqRepository.getRfqByQuoteId(response.quoteId);

      if (Number(!rfq || !(rfq.status === RfqStatus.OPEN))) {
        res.status(403).json({
          error: [
            {
              path: "rfqId",
              msg: "Conversations are locked once RFQ is either closed or awarded",
            },
          ],
        });
        return;
      }
    }

    next();
  } catch (error) {
    return generalErrorResponse(error, res);
  }
};

export default validateOpenIfRFQ;
