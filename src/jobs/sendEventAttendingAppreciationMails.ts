import cron from "node-cron";
import sendEventAttendingAppreciationEmail from "../utils/sendEventAttendingAppreciationNotifiers";
import eventRepository from "../repositories/EventRepository";
import UserRepository from "../repositories/UserRepository";

async function sendEventAttendingAppreciationMails() {
  try {
    const completedEvents = await eventRepository.getCompletedEvents(
      new Date(),
    );

    for (const event of completedEvents) {
      const userIds = await UserRepository.getUsersAssignedToEvent(event.id);
      const userIdsArray = userIds.map((user) => user.id);

      await sendEventAttendingAppreciationEmail(
        userIdsArray,
        event.title,
        event.startDate,
      );

      console.info(
        `[Notification] Event appreciation processed for event ${event.id}. Expo push is disabled.`,
      );
    }
  } catch (error) {
    console.error("Error in sending event appreciation emails:", error);
  }
}

function setupEventNotificationJob() {
  const eventAppreciations = cron.schedule(
    "58 23 * * *",
    async () => {
      console.log("Running daily event appreciation Emailing job...");
      await sendEventAttendingAppreciationMails();
      console.log("Event participation emails sent successfully.");
    },
    {
      scheduled: true,
      timezone: "UTC",
    },
  );

  console.log(
    "Scheduled Job for sending Appreciation Emails to Event Attendees",
  );

  return eventAppreciations;
}

export default {
  sendEventAttendingAppreciationMails,
  setupEventNotificationJob,
};
