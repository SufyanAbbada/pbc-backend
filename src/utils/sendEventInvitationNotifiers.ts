import UserRepository from "../repositories/UserRepository";
import UserNotificationRepository from "../repositories/userNotificationsRepository";
import { sendEmail } from "../services/twilioService";
import {
  eventInvitationEmailTemplate,
  eventInvitationNotificationTemplate,
} from "../templates/eventInvitationTemplate";

const formatDate = (date: Date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const sendEventEmailAndNotification = async (
  userIds: number[],
  title: string,
  details: string,
  startDate: Date,
  endDate: Date,
  assignerName: string,
) => {
  for (const userId of userIds) {
    const user = await UserRepository.getUserById(userId);
    if (user) {
      const emailContent = eventInvitationEmailTemplate(
        user.name,
        title,
        details,
        startDate,
        endDate,
        assignerName,
      );

      await sendEmail(user.email, "Event Invitation from PBC", emailContent);

      const notificationContent = eventInvitationNotificationTemplate(
        title,
        assignerName,
        startDate,
      );

      await UserNotificationRepository.createNotification(
        userId,
        notificationContent,
      );

      console.info(
        `[Notification] Stored event invitation notification for user ${userId}. Expo push is disabled.`,
      );
    }
  }
};

export default sendEventEmailAndNotification;
