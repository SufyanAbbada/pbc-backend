import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { processElectionResults } from "../utils/processElectionResults";

const prisma = new PrismaClient();

async function processClosedElections() {
  try {
    console.log("Running daily closed elections processing");

    const closedElections = await prisma.election.findMany({
      where: {
        endDate: { lt: new Date() },
        AND: [
          {
            OR: [
              {
                type: "CANDIDATE_ELECTION",
                electedId: null,
              },
              {
                type: "POLICY_ELECTION",
                policyVotes: null,
              },
            ],
          },
        ],
      },
    });

    console.log(`Found ${closedElections.length} closed elections to process`);

    for (const election of closedElections) {
      try {
        const result = await processElectionResults(election.id);
        console.log(`Successfully processed election ${election.id}:`, result);
      } catch (error) {
        console.error(`Error processing election ${election.id}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in daily election processing:", error);
  }
}

function setupElectionsResultsCalculationJob() {
  const task = cron.schedule("0 0 * * *", processClosedElections, {
    scheduled: true,
    timezone: "UTC",
  });

  console.log("Scheduled Job for daily election processing at midnight");

  return task;
}

export default {
  processImmediately: processElectionResults,
  setupElectionsResultsCalculationJob,
  processClosedElections,
};
