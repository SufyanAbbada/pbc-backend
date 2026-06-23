import cron from "node-cron";
import JobPostRepository from "../repositories/JobPostRepository";

async function cleanExpiredJobs() {
  try {
    await JobPostRepository.closeJobPosts();
    console.log("All expired jobs have been cleaned up successfully.");
  } catch (error) {
    console.error("Error in daily election processing:", error);
  }
}

function setupExpiredJobsCleaner() {
  const jobs = cron.schedule("0 0 * * *", cleanExpiredJobs, {
    scheduled: true,
    timezone: "UTC",
  });

  console.log("Scheduled Job for cleaning up expired jobs at midnight");

  return jobs;
}

export default {
  cleanExpiredJobsImmediately: cleanExpiredJobs,
  setupExpiredJobsCleaner,
};
