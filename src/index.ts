import http from "http";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { config } from "dotenv";
config();
import router from "./routes/index";
import cleanupExpiredOtps from "./jobs/cleanupExpiredOtps";
import jsonErrorHandler from "./middlewares/jsonErrorHandler";
import requestAndResponseLogger from "./middlewares/logger/requestAndResponseLogger";
import closedElectionsJob from "./jobs/closedElectionsJob";
import notifyExpiryDateJob from "./jobs/notifyExpiryDateJob";
import cleanupExpiredJobs from "./jobs/cleanupExpiredJobs";
import sendEventAttendingAppreciationMails from "./jobs/sendEventAttendingAppreciationMails";
import cleanupExpiredTempUsers from "./jobs/cleanupExpiredTempUser";
import { initSocket } from "./jobs/socketConnection";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestAndResponseLogger);

// Routes
app.use("/api", router);

// Custom Global Error Handlers
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    jsonErrorHandler(err, req, res, next);
  },
);

const server = http.createServer(app);

initSocket(server);

// Setup the daily midnight job for cleaning up expired OTP Requests
cleanupExpiredOtps.setupExpiredOTPsCleaner();
// Setup the daily midnight job for cleaning up expired jobs
cleanupExpiredJobs.setupExpiredJobsCleaner();
// Setup the daily midnight job for processing completed election's results
closedElectionsJob.setupElectionsResultsCalculationJob();
// Setup the daily midnight job for processing membership expiry dates
notifyExpiryDateJob.setupMembershipDateExpiryJob();
// Setup the daily midnight job for sending Event Attending Appreciations
sendEventAttendingAppreciationMails.setupEventNotificationJob();
// Setup daily job for cleaing temp users
cleanupExpiredTempUsers.setupTempUserCleanupJob();

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Application up and running on http://localhost:${PORT}`);
  console.log("This is from Staging Branch");
});
