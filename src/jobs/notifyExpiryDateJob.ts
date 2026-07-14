import cron from "node-cron";
import membershipRepository from "../repositories/membershipRepository";
import UserNotificationRepository from "../repositories/userNotificationsRepository";
import { sendEmail } from "../services/twilioService";
import {
  addDaysToDate,
  formatNotificationPeriod,
  isSameDay,
} from "../utils/datesProcessor";
import {
  documentsExpiryEmailTemplate,
  documentsExpiryPushNotificationTemplate,
} from "../templates/expiryNotificationTemplates";

const CHECK_ONE_DAY = 1;
const CHECK_TEN_DAYS = 10;
const CHECK_THIRTY_DAYS = 30;

async function checkAndNotifyMembershipExpiry() {
  try {
    const today = new Date();
    const daysToCheck = [CHECK_ONE_DAY, CHECK_TEN_DAYS, CHECK_THIRTY_DAYS];
    const thirtyOneDaysFromNow = new Date();
    thirtyOneDaysFromNow.setDate(
      today.getDate() + (CHECK_THIRTY_DAYS + CHECK_ONE_DAY),
    );

    const memberships =
      await membershipRepository.getApprovedAndInRangeMemberships(
        today,
        thirtyOneDaysFromNow,
      );

    for (const membership of memberships) {
      for (const days of daysToCheck) {
        const targetDate = addDaysToDate(today, days);

        const sendExpiryNotification = async (
          expiryDate: Date,
          attribute: string,
        ) => {
          const period = formatNotificationPeriod(days);

          await sendEmail(
            membership.user.email,
            `${attribute} Expiry`,
            documentsExpiryEmailTemplate({
              userName: membership.user.name,
              period,
              expiryDate,
              attribute,
            }),
          );

          await UserNotificationRepository.createNotification(
            membership.user.id,
            documentsExpiryPushNotificationTemplate({
              period,
              expiryDate,
              attribute,
            }),
          );

          console.log(
            `Processed ${attribute.toLowerCase()} expiry email & in-app notification for ${membership.user.email} (expires in ${period}). Expo push is disabled.`,
          );
        };

        // Passport Expiry Notification
        const passportExpiryDate = new Date(membership.passportExpiryDate);
        if (isSameDay(passportExpiryDate, targetDate)) {
          await sendExpiryNotification(passportExpiryDate, "Passport");
        }

        // Emirates ID Expiry Notification
        const emiratesIdExpiryDate = new Date(membership.emiratesIdExpiryDate);
        if (isSameDay(emiratesIdExpiryDate, targetDate)) {
          await sendExpiryNotification(emiratesIdExpiryDate, "Emirates ID");
        }

        // Trade License Expiry Notification
        const tradeLicenseExpiryDate = new Date(membership.tradeLicenseExpiry);
        if (isSameDay(tradeLicenseExpiryDate, targetDate)) {
          await sendExpiryNotification(tradeLicenseExpiryDate, "Trade License");
        }
      }
    }
  } catch (error) {
    console.error("Error in membership expiry notification:", error);
  }
}

function setupMembershipDateExpiryJob() {
  // Runs every day at 00:00 UTC
  const task = cron.schedule("0 0 * * *", checkAndNotifyMembershipExpiry, {
    scheduled: true,
    timezone: "UTC",
  });

  console.log("Scheduled Job for membership expiry notifications at midnight");

  return task;
}

export default {
  notifyImmediately: checkAndNotifyMembershipExpiry,
  setupMembershipDateExpiryJob,
};
