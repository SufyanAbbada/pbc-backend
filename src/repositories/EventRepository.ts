import prisma from "../config/prismaClient";
import {
  EventAttendanceStatus,
  EventMOMApprovalStatus,
  EventType,
} from "../common/enums";
import { Event, EventMedia } from "../common/types";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";
import { Prisma } from "@prisma/client";

class EventRepository {
  async createEvent(eventData: Event) {
    return await prisma.event.create({ data: eventData });
  }

  async getEventById(eventId: number) {
    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        EventAssignee: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        EventMOMApproval: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        EventMedia: true,
        EventActionPoint: true,
        eventMOMEditor: true,
      },
    });
  }

  async getEvents(
    userId?: number,
    page?: number,
    limit?: number,
    eventType?: EventType,
  ) {
    const skip = calculatePaginationSkip(page, limit);
    const where: Prisma.EventWhereInput = userId ? { userId } : {};
    if (eventType) where.eventType = eventType;

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        omit: { eventMOM: true },
        include: {
          _count: {
            select: { EventMOMApproval: true, EventAssignee: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, totalCount };
  }

  async getEventsMOM(
    status: EventMOMApprovalStatus = EventMOMApprovalStatus.APPROVED,
    page?: number,
    limit?: number,
  ) {
    const skip = calculatePaginationSkip(page, limit);
    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: {
          eventMOMStatus: status,
        },
        skip,
        take: limit,
        include: {
          _count: {
            select: { EventMOMApproval: true, EventAssignee: true },
          },
        },
      }),
      prisma.event.count({ where: { eventMOMStatus: status } }),
    ]);

    return { events, totalCount };
  }

  async getUserAssignedEvents(userId: number, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where: {
          EventAssignee: {
            some: {
              userId,
            },
          },
        },
        skip,
        take: limit,
        omit: { eventMOM: true },
        include: {
          _count: {
            select: { EventMOMApproval: true, EventAssignee: true },
          },
        },
      }),
      prisma.event.count({ where: { EventAssignee: { some: { userId } } } }),
    ]);

    return { events, totalCount };
  }

  async checkUserAssignedEvent(userId: number, eventId: number) {
    return await prisma.event.findUnique({
      where: { id: eventId, EventAssignee: { some: { userId } } },
      include: {
        EventMedia: true,
      },
    });
  }

  async getUserAssignedEventDetail(eventId: number) {
    const userAssignedEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!userAssignedEvent) return null;

    const { eventMOM, ...rest } = userAssignedEvent;

    return userAssignedEvent.eventMOMStatus === EventMOMApprovalStatus.APPROVED
      ? userAssignedEvent
      : rest;
  }

  async searchEvents(searchTerm: string, page?: number, limit?: number) {
    const skip = calculatePaginationSkip(page, limit);

    const where: Prisma.EventWhereInput = {
      OR: [
        { title: { contains: searchTerm, mode: Prisma.QueryMode.insensitive } },
        {
          details: { contains: searchTerm, mode: Prisma.QueryMode.insensitive },
        },
        {
          eventMOM: {
            contains: searchTerm,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };

    const [events, totalCount] = await Promise.all([
      prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.count({ where }),
    ]);

    return { events, totalCount };
  }

  async updateEvent(eventId: number, eventData: Partial<Event>) {
    return await prisma.event.update({
      where: { id: eventId },
      data: eventData,
    });
  }

  async assignUsersToEvent(eventId: number, userIds: number[]) {
    await prisma.eventAssignee.createMany({
      data: userIds.map((userId) => ({
        eventId,
        userId,
      })),
    });

    await prisma.eventAttendance.createMany({
      data: userIds.map((userId) => ({
        eventId,
        userId,
        status: EventAttendanceStatus.NOT_ATTENDED,
      })),
    });

    return await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        EventAssignee: {
          include: { user: { select: { id: true, name: true, email: true } } },
        },
        EventActionPoint: true,
      },
    });
  }

  async isUserAssignedToEvent(eventId: number, userId: number) {
    const assignment = await prisma.eventAssignee.findFirst({
      where: { eventId, userId },
    });
    return !!assignment;
  }

  async bulkCreateEventMedia(mediaData: EventMedia[]) {
    return await prisma.eventMedia.createManyAndReturn({
      data: mediaData,
    });
  }

  async getCompletedEvents(date: Date) {
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    endOfDay.setHours(23, 59, 59, 999);

    return await prisma.event.findMany({
      where: {
        endDate: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });
  }

  async getRecentEventByType(eventType: EventType) {
    return await prisma.event.findFirst({
      where: {
        eventType,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }
}

export default new EventRepository();
