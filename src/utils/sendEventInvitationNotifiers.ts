import UserRepository from "../repositories/UserRepository";
import UserNotificationRepository from "../repositories/userNotificationsRepository";
import expoNotificationService from "../services/expoNotificationService";
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

      await expoNotificationService.sendMultiUserNotification(
        [userId],
        "New Event Invitation",
        `${assignerName} has invited you to ${title} starting on ${formatDate(startDate)}`,
        {
          type: "EVENT_INVITATION",
        },
      );
    }
  }
};

export default sendEventEmailAndNotification;
