import cron from "node-cron";
import OtpRepository from "../repositories/OtpRepository";

async function cleanupExpiredOtps() {
  try {
    await OtpRepository.deleteExpiredOtps();
  } catch (error: any) {
    console.error("Error occured while clearing Otps:", error);
  }
}

function setupExpiredOTPsCleaner() {
  cron.schedule("0 0 * * 1", async () => {
    console.log("Running weekly OTP cleanup...");
    await cleanupExpiredOtps();
    console.log("All expired OTPs have been cleaned up successfully.");
  });

  console.log("Scheduled Job for cleaning up expired OTP requests at midnight");
}

export default {
  cleanupExpiredOtps,
  setupExpiredOTPsCleaner,
};
