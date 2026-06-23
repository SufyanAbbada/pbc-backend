import pushTokenRepository from "../repositories/pushTokenRepository";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { ExpoPushTicket } from "../common/types";

class ExpoNotificationService {
  private expo: Expo;

  constructor() {
    this.expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN });
  }

  async sendMultiUserNotification(
    userIds: number[],
    title: string,
    body: string,
    data: Record<string, string> = {},
    sound: string = "default",
  ): Promise<Record<number, ExpoPushTicket[] | null>> {
    const results: Record<number, ExpoPushTicket[] | null> = {};

    for (const userId of userIds) {
      try {
        const userTokens = await pushTokenRepository.findTokensByUserId(userId);
        if (!userTokens?.length) continue;

        const expoTokens = userTokens
          .map((tokenObj) => tokenObj.token)
          .filter((token) => Expo.isExpoPushToken(token));
        if (!expoTokens.length) continue;

        const messages: ExpoPushMessage[] = expoTokens.map((token) => ({
          to: token,
          sound,
          title,
          body,
          data,
        }));

        const ticketChunks =
          await this.expo.sendPushNotificationsAsync(messages);

        ticketChunks.forEach((ticket) => {
          if (ticket.status === "error") {
            console.error(
              `Error sending notification to user with id (${userId}):`,
              ticket.message,
              ticket.details,
            );
          }
        });

        results[userId] = ticketChunks;
      } catch (error) {
        console.error(
          `Failed to send push notification to user ${userId}:`,
          error,
        );
        results[userId] = null;
      }
    }

    return results;
  }
}

export default new ExpoNotificationService();
