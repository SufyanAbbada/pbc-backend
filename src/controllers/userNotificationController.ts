import UserNotificationRepository from "../repositories/userNotificationsRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";

class UserNotificationController {
  async getAllNotifications(req: Request, res: Response) {
    try {
      const {
        user,
        pagination: { page, limit },
      } = req.body;

      const { notifications, totalCount } =
        await UserNotificationRepository.getNotificationsByUserId(
          Number(user.id),
          page,
          limit,
        );

      await UserNotificationRepository.markAllAsRead(Number(user.id));

      const response = {
        message: "Notifications fetched for the user and marked as read.",
        data: notifications,
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

  async getUnreadNotifications(req: Request, res: Response) {
    try {
      const { user } = req.body;

      const unreadNotifications =
        await UserNotificationRepository.getUnreadNotifications(
          Number(user.id),
        );

      await UserNotificationRepository.markAllAsRead(Number(user.id));

      return res.status(200).json({
        message:
          "User's unread notifications fetched and marked as Read successfully.",
        data: unreadNotifications,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new UserNotificationController();
