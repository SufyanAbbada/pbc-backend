import { Request, Response } from "express";

class ChatController {
  async generateTokenForChat(req: Request, res: Response) {
    console.info(
      "[Chat] Twilio Conversations token requested, but chat is disabled.",
    );
    return res.status(410).json({
      error: [
        {
          path: "chat",
          msg: "Chat is disabled. Twilio Conversations is not used in this environment.",
        },
      ],
    });
  }

  async generateTokenForCall(req: Request, res: Response) {
    console.info(
      "[Chat] Twilio Video token requested, but calls are disabled.",
    );
    return res.status(410).json({
      error: [
        {
          path: "call",
          msg: "Audio/video calls are disabled. Twilio Video is not used in this environment.",
        },
      ],
    });
  }
}

export default new ChatController();
