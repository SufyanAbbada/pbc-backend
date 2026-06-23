import EventActionPointRepository from "../../repositories/EventActionPointsRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { SourceType } from "../../common/enums";

const validateActionPointExistence = (
  source: SourceType = SourceType.PARAM,
): RequestHandler => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const actionPointId =
      source === SourceType.BODY
        ? req.body.actionPointId
        : req.params.actionPointId;

    if (actionPointId) {
      const actionPoint = await EventActionPointRepository.getActionPointById(
        Number(actionPointId),
      );

      if (!actionPoint) {
        res.status(404).json({
          error: [
            {
              path: "actionPointId",
              msg: "We couldn’t find the action point. Please check the details and try again",
            },
          ],
        });
        return;
      }
      req.body.actionPoint = actionPoint;
    }

    next();
  };
};

export default validateActionPointExistence;
