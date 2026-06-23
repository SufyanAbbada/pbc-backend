import EventActionPointRepository from "../../repositories/EventActionPointsRepository";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { EventActionPointStatus, SourceType } from "../../common/enums";

const validateActionPointCompleted = (
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

      if (
        actionPoint &&
        actionPoint.status === EventActionPointStatus.COMPLETED
      ) {
        res.status(400).json({
          error: [
            {
              path: "actionPointId",
              msg: "This action point has already been marked as completed",
            },
          ],
        });
        return;
      }
    }

    next();
  };
};

export default validateActionPointCompleted;
