import rfqRepository from "../../repositories/RfqRepository";
import generalErrorResponse from "../../utils/generalErrorResponse";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateExistingRfq = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const rfqId =
        source === SourceType.BODY
          ? (req.body.rfqId as string)
          : (req.params.rfqId as string);

      const rfq = await rfqRepository.getRfqById(Number(rfqId));

      if (!rfq) {
        res.status(404).json({
          error: [
            {
              path: "rfqId",
              msg: "We couldn’t find this RFQ in the system. Please recheck the rfq ID",
            },
          ],
        });
        return;
      }

      req.body.rfq = rfq;
      next();
    } catch (error) {
      return generalErrorResponse(error, res);
    }
  };
};

export default validateExistingRfq;
