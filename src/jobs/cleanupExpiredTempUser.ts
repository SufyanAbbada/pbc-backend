import TempUserRepository from "../repositories/TempUserRepository";
import cron from "node-cron";

async function cleanupExpiredTempUsers() {
  try {
    await TempUserRepository.deleteExpiredTempUsers();
  } catch (error: any) {
    console.error("Error occured while clearing TempUsers:", error);
  }
}

function setupTempUserCleanupJob() {
  const jobs = cron.schedule("*/30 * * * *", cleanupExpiredTempUsers, {
    scheduled: true,
    timezone: "UTC",
  });

  console.log("Scheduled Job for cleaning up expired jobs at midnight");
  return jobs;
}

export default {
  tempUserCleanupImmediately: cleanupExpiredTempUsers,
  setupTempUserCleanupJob,
};
