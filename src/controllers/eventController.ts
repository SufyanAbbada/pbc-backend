import EventRepository from "../repositories/EventRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import EventApprovalRepository from "../repositories/EventApprovalRepository";
import s3Service from "../services/s3Service";
import EventActionPointsRepository from "../repositories/EventActionPointsRepository";
import sendEventEmailAndNotification from "../utils/sendEventInvitationNotifiers";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { AssetTypes, EventMOMApprovalStatus, EventType } from "../common/enums";
import { DAY_PERIOD } from "../common/constants";

class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      const {
        title,
        venue,
        details,
        startDate,
        endDate,
        userIds,
        eventType,
        actionPoints,
        user: { id, name },
      } = req.body;

      const event = await EventRepository.createEvent({
        title,
        venue,
        details,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        userId: Number(id),
        eventType,
      });

      if (eventType === EventType.BOARD_MEETING && actionPoints) {
        await EventActionPointsRepository.markPendingActionPointsAsTransferred();
        await EventActionPointsRepository.bulkCreateActionPoints(
          event.id,
          actionPoints,
        );
      }

      const completeEventDetails = await EventRepository.assignUsersToEvent(
        event.id,
        userIds,
      );

      await sendEventEmailAndNotification(
        userIds,
        title,
        details,
        new Date(startDate),
        new Date(endDate),
        name,
      );

      return res.status(201).json({
        message:
          "Event created, users assigned, and notifications sent successfully",
        data: completeEventDetails,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getEventById(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const event = await EventRepository.getEventById(Number(eventId));
      if (!event) {
        return res.status(404).json({
          error: [
            {
              path: "eventId",
              msg: "We couldn't find the event you're looking for. Please check and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Event fetched successfully",
        data: event,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateEventMOM(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const { eventMOM, user } = req.body;

      await EventApprovalRepository.deleteApprovals(Number(eventId));

      const updatedEvent = await EventRepository.updateEvent(Number(eventId), {
        eventMOM,
        eventMOMStatus: EventMOMApprovalStatus.PENDING,
        eventMOMEditorId: user.id,
      });

      return res.status(200).json({
        message: "Event MOM Added successfully. Approvals Pending.",
        data: updatedEvent,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getEventsMOM(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;
      const { status } = req.query;

      const { events, totalCount } = await EventRepository.getEventsMOM(
        status as EventMOMApprovalStatus,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Events MOM fetched successfully",
        data: events,
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

  async getMyEvents(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
        pagination: { page, limit },
      } = req.body;
      const { events, totalCount } = await EventRepository.getEvents(
        Number(userId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Your events fetched successfully",
        data: events,
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

  async getEvents(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;

      const { events, totalCount } = await EventRepository.getEvents(
        undefined,
        page,
        limit,
        EventType.REGULAR_EVENT,
      );

      const response: PaginationResponse = {
        message: "Regular Events fetched successfully",
        data: events,
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

  async getBoardMeetingEvents(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;

      const { events, totalCount } = await EventRepository.getEvents(
        undefined,
        page,
        limit,
        EventType.BOARD_MEETING,
      );

      const response: PaginationResponse = {
        message: "Board Meeting Events fetched successfully",
        data: events,
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

  async getMyAssignedEvents(req: Request, res: Response) {
    try {
      const {
        user: { id: userId },
      } = req.body;
      const {
        pagination: { page, limit },
      } = req.body;

      const { events, totalCount } =
        await EventRepository.getUserAssignedEvents(
          Number(userId),
          page,
          limit,
        );

      const response: PaginationResponse = {
        message: "Your events fetched successfully",
        data: events,
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

  async getMyAssignedEventDetail(req: Request, res: Response) {
    try {
      const { eventId } = req.params;

      const event = await EventRepository.getUserAssignedEventDetail(
        Number(eventId),
      );

      if (!event) {
        return res.status(404).json({
          error: [
            {
              path: "eventId",
              msg: "We couldn't find the event you're looking for. Please check and try again.",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Event fetched successfully",
        data: event,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async uploadEventMedia(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const { eventMedia } = req.body;

      const uploadedMedia = await Promise.all(
        eventMedia.map(async (file: { key: string; value: string }) => {
          const mediaUrl = await s3Service.uploadAsset(
            file.value,
            AssetTypes.MEDIA,
          );
          return {
            eventId: Number(eventId),
            assetURL: mediaUrl,
          };
        }),
      );

      const createdMedia =
        await EventRepository.bulkCreateEventMedia(uploadedMedia);

      return res.status(201).json({
        message: "Media uploaded successfully",
        data: createdMedia,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateEvent(req: Request, res: Response) {
    try {
      const { eventId } = req.params;
      const { title, details, startDate, endDate, userId, venue } = req.body;

      const updatedEvent = await EventRepository.updateEvent(Number(eventId), {
        title,
        venue,
        details,
        startDate,
        endDate,
        ...(userId && { userId: Number(userId) }),
      });

      return res.status(200).json({
        message: "Event updated successfully",
        data: updatedEvent,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new EventController();
