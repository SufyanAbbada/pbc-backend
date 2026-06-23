import generalErrorResponse from "../utils/generalErrorResponse";
import {
  generateAccessTokenForChat,
  generateAccessTokenForCall,
} from "../services/twilioService";
import { Request, Response } from "express";

class ChatController {
  async generateTokenForChat(req: Request, res: Response) {
    try {
      const { user } = req.body;
      const conversationAccessToken = generateAccessTokenForChat(user.email);

      res.status(200).json({
        message: "Token for Chat Generated Successfully.",
        data: {
          conversationAccessToken,
        },
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async generateTokenForCall(req: Request, res: Response) {
    try {
      const { user, room } = req.body;
      const callAccessToken = generateAccessTokenForCall(user.email, room);

      res.status(200).json({
        message: "Token for Video/Audio Call Generated Successfully.",
        data: {
          callAccessToken,
        },
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new ChatController();
