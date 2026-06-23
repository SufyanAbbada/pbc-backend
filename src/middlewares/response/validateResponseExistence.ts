import responseRepository from "../../repositories/ResponseRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateResponseExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const responseId =
      source === SourceType.BODY ? req.body.responseId : req.params.responseId;

    const response = await responseRepository.getResponseById(
      Number(responseId),
    );

    if (!response) {
      res.status(404).json({
        error: [
          {
            path: "responseId",
            msg: "We couldn’t find the response. Please recheck the response ID",
          },
        ],
      });
      return;
    }

    req.body.response = response;

    next();
  };
};

export default validateResponseExistence;
