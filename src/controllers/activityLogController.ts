import ActivityLogRepository from "../repositories/ActivityLogRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import csvService from "../services/csvService";
import { Request, Response } from "express";
import { FullActivityLog, PaginationResponse } from "../common/types";
import { Interaction, InteractionType } from "../common/enums";
import { paginate } from "../utils/pagination";

class ActivityLogController {
  async logActivity(req: Request, res: Response) {
    try {
      const {
        user: { id: observerId },
        interactedUser: { id: interactedUserId },
        interaction,
        interactionType,
      } = req.body;

      const activityLog = await ActivityLogRepository.createActivityLog({
        observerId,
        interactedUserId,
        interaction,
        interactionType,
      });

      return res.status(201).json({
        message: "Activity logged successfully",
        data: activityLog,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllActivityLogs(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;
      const { interaction, interactionType, interactedUserId, observerId } =
        req.query;

      const { logs, totalCount } =
        await ActivityLogRepository.getAllActivityLogs(page, limit, {
          interaction: interaction as Interaction,
          interactionType: interactionType as InteractionType,
          interactedUserId: Number(interactedUserId),
          observerId: Number(observerId),
        });

      const response: PaginationResponse = {
        message: "Activity logs fetched successfully",
        data: logs,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async exportActivityLogs(req: Request, res: Response) {
    try {
      const { logs } = await ActivityLogRepository.getAllActivityLogs();

      const csvRows = (logs as FullActivityLog[]).map((log) => ({
        "Observer Name": log.Observer?.name || "",
        "Observer Email": log.Observer?.email || "",
        "Observer Phone": log.Observer?.phoneNumber || "",
        "Interacted User Name": log.InteractedUser?.name || "",
        "Interacted User Email": log.InteractedUser?.email || "",
        "Interacted User Phone": log.InteractedUser?.phoneNumber || "",
        Interaction: log.interaction,
        "Interaction Type": log.interactionType,
        // * Will need to remove this line if time is already stored in Dubai timezone
        "Interacted At": new Date(log.createdAt).toLocaleString("en-US", {
          timeZone: "Asia/Dubai",
        }),
      }));

      const csvString = await csvService.dataToString(csvRows);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=activity_logs.csv",
      );
      res.status(200).send(csvString);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new ActivityLogController();
