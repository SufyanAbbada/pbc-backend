import PushTokenRepository from "../repositories/pushTokenRepository";
import expoNotificationService from "../services/expoNotificationService";
import generalErrorResponse from "../utils/generalErrorResponse";
import { User } from "@prisma/client";
import { Request, Response } from "express";

class PushTokenController {
  async registerToken(req: Request, res: Response) {
    try {
      let { user, token, pushNotificationToken } = req.body;

      if (!pushNotificationToken) {
        pushNotificationToken = await PushTokenRepository.create(
          Number(user.id),
          token,
        );
      }

      return res.status(201).json({
        message: "Push token was registered successfully for the user.",
        data: pushNotificationToken,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getUserTokens(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const { userId } = req.params;

      const tokens = await PushTokenRepository.findTokensByUserId(
        userId ? Number(userId) : Number(user.id),
      );

      return res.status(200).json({
        message: "User push tokens retrieved successfully",
        data: tokens,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllTokens(req: Request, res: Response) {
    try {
      const tokens = await PushTokenRepository.getAllTokens();

      return res.status(200).json({
        message: "All push tokens retrieved successfully",
        data: tokens,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteToken(req: Request, res: Response) {
    try {
      const { pushNotificationToken } = req.body;

      await PushTokenRepository.deleteToken(Number(pushNotificationToken.id));

      return res.status(204).json({
        message: "Push Token has been removed.",
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteAllUserTokens(req: Request, res: Response) {
    try {
      const { user } = req.body;

      await PushTokenRepository.deleteTokensByUserId(Number(user.id));

      return res.status(204).json({
        message: `All push tokens for the user have been removed`,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  // * This method must be called after `validateUsersExistenceByEmails` middleware
  async sendCallNotification(req: Request, res: Response) {
    try {
      const { callFrom, callType, roomName, type, users } = req.body;

      const userIds = users.map((user: User) => user.id);

      const results = await expoNotificationService.sendMultiUserNotification(
        userIds,
        `Incoming Call from ${callFrom}`,
        `You have a ${callType} call`,
        {
          type,
          callType,
          roomName,
          caller: callFrom,
        },
        "ringtone",
      );

      return res.status(200).json({
        message: "Call notifications sent successfully",
        data: results,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new PushTokenController();
