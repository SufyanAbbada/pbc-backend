import { Request, Response, NextFunction, RequestHandler } from "express";
import { ElectionType } from "../../common/enums";

const validateElectionTypeConstraints: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { type, candidateIds, policyId, pollOptions } = req.body;

  if (type === ElectionType.CANDIDATE_ELECTION) {
    if (
      !candidateIds ||
      !Array.isArray(candidateIds) ||
      candidateIds.length === 0
    ) {
      res.status(400).json({
        error: [
          {
            path: "candidateIds",
            msg: "Candidate IDs are required for candidate elections.",
          },
        ],
      });
      return;
    }

    if (policyId) {
      res.status(400).json({
        error: [
          {
            path: "policyId",
            msg: "Policy ID should not be provided for candidate elections.",
          },
        ],
      });
      return;
    }

    if (pollOptions && Array.isArray(pollOptions) && pollOptions.length > 0) {
      res.status(400).json({
        error: [
          {
            path: "pollOptions",
            msg: "Poll options should not be provided for candidate elections.",
          },
        ],
      });
      return;
    }
  }

  if (type === ElectionType.POLICY_ELECTION) {
    if (!policyId) {
      res.status(400).json({
        error: [
          {
            path: "policyId",
            msg: "Policy ID is required for policy elections.",
          },
        ],
      });
      return;
    }

    if (
      candidateIds &&
      Array.isArray(candidateIds) &&
      candidateIds.length > 0
    ) {
      res.status(400).json({
        error: [
          {
            path: "candidateIds",
            msg: "Candidate IDs should not be provided for policy elections.",
          },
        ],
      });
      return;
    }

    if (pollOptions && Array.isArray(pollOptions) && pollOptions.length > 0) {
      res.status(400).json({
        error: [
          {
            path: "pollOptions",
            msg: "Poll options should not be provided for policy elections.",
          },
        ],
      });
      return;
    }
  }

  if (type === ElectionType.POLLING_ELECTION) {
    if (
      !pollOptions ||
      !Array.isArray(pollOptions) ||
      pollOptions.length === 0
    ) {
      res.status(400).json({
        error: [
          {
            path: "pollOptions",
            msg: "Poll options are required for polling elections.",
          },
        ],
      });
      return;
    }

    if (
      candidateIds &&
      Array.isArray(candidateIds) &&
      candidateIds.length > 0
    ) {
      res.status(400).json({
        error: [
          {
            path: "candidateIds",
            msg: "Candidate IDs should not be provided for polling elections.",
          },
        ],
      });
      return;
    }

    if (policyId) {
      res.status(400).json({
        error: [
          {
            path: "policyId",
            msg: "Policy ID should not be provided for polling elections.",
          },
        ],
      });
      return;
    }
  }

  next();
};

export default validateElectionTypeConstraints;
