import initiativeRepository from "../../repositories/initiativeRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateInitiativeExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const initiativeId =
      source === SourceType.BODY
        ? req.body.initiativeId
        : req.params.initiativeId;

    const initiative = await initiativeRepository.getInitiativeById(
      Number(initiativeId),
    );

    if (!initiative) {
      res.status(404).json({
        error: [
          {
            path: "initiativeId",
            msg: "We couldn't find an initiative with the given ID",
          },
        ],
      });
      return;
    }

    req.body.initiative = initiative;
    next();
  };
};
export default validateInitiativeExistence;
