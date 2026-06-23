import EventActionPointRepository from "../repositories/EventActionPointsRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class EventActionPointController {
  async getRecentPendingActionPoints(req: Request, res: Response) {
    try {
      const actionPoints =
        await EventActionPointRepository.getRecentPendingActionPoints();

      return res.status(200).json({
        message: "Action points fetched successfully",
        data: actionPoints,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateActionPointStatus(req: Request, res: Response) {
    try {
      const { actionPointId } = req.params;
      const { status } = req.body;

      const updatedPoint =
        await EventActionPointRepository.updateActionPointStatus(
          Number(actionPointId),
          status,
        );

      return res.status(200).json({
        message: "Action point status updated successfully",
        data: updatedPoint,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new EventActionPointController();
