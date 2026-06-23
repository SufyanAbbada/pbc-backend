import ElectionRepository from "../repositories/electionRepository";
import VoteRepository from "../repositories/voteRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { Election } from "../common/types";
import { processElectionResults } from "../utils/processElectionResults";
import { ElectionState, ElectionStatus, ElectionType } from "../common/enums";
import { paginate } from "../utils/pagination";
import { DAY_PERIOD } from "../common/constants";

class ElectionController {
  async addElection(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        startDate,
        endDate,
        type,
        policyId,
        candidateIds,
        pollOptions,
      } = req.body;

      const electionData: Election = {
        title,
        description,
        type,
        state: ElectionState.ACTIVE,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        ...(policyId && { policyId: Number(policyId) }),
        ...(candidateIds?.length && {
          candidates: {
            connect: candidateIds.map((id: number) => ({ id })),
          },
        }),
        ...(pollOptions && { pollOptions }),
      };

      const election = await ElectionRepository.addElection(electionData);

      return res.status(201).json({
        message: "Election created successfully",
        data: election,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getElectionById(req: Request, res: Response) {
    try {
      const { electionId } = req.params;
      const { user } = req.body;

      const election = await ElectionRepository.getElectionById(
        Number(electionId),
      );

      if (!election) {
        return res.status(404).json({
          message: "We couldn't find an election with the provided ID.",
        });
      }

      const hasVoted = await VoteRepository.getVoteByUserOnElection(
        Number(user.id),
        Number(electionId),
      );

      return res.status(200).json({
        message: "Election retrieved successfully",
        data: {
          ...election,
          hasVoted: !!hasVoted,
        },
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteElection(req: Request, res: Response) {
    try {
      const { electionId } = req.params;

      const deletedElection = await ElectionRepository.deleteElection(
        Number(electionId),
      );

      return res.status(200).json({
        message: "Election retrieved successfully",
        data: deletedElection,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllElections(req: Request, res: Response) {
    try {
      const { type, status } = req.query;
      const {
        pagination: { page, limit },
      } = req.body;

      const { elections, totalCount } =
        await ElectionRepository.getAllElections(
          (type as ElectionType) || undefined,
          (status as ElectionStatus) || undefined,
          page,
          limit,
        );

      return res.status(200).json({
        message: "Election retrieved successfully",
        data: elections,

        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async castVote(req: Request, res: Response) {
    const { vote, electionId, user } = req.body;

    const voting = await VoteRepository.addVote({
      userId: Number(user.id),
      vote: String(vote),
      electionId: Number(electionId),
    });

    return res.status(200).json({
      message: "Vote Casted successfully",
      data: voting,
    });
  }

  async getElectionResults(req: Request, res: Response) {
    try {
      const { election } = req.body;

      let electionResults = null;

      if (election.state === ElectionState.ACTIVE) {
        electionResults = await processElectionResults(Number(election.id));
      }

      res.status(200).json({
        message: "Election results retrieved successfully",
        data: electionResults ? electionResults.result : election,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateElection(req: Request, res: Response) {
    try {
      const { electionId } = req.params;
      const { title, description } = req.body;

      const electionData: Partial<Election> = {
        title,
        description,
      };

      const election = await ElectionRepository.updateElection(
        Number(electionId),
        electionData,
      );

      return res.status(200).json({
        message: "Election Updated successfully",
        data: election,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async searchElections(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;
      const { search } = req.query;

      const { elections, totalCount } =
        await ElectionRepository.searchElections(search as string, page, limit);

      const response = {
        message: "Search results for elections fetched successfully",
        data: elections,
        ...(page &&
          limit && {
            pagination: paginate(totalCount, page, limit),
          }),
      };

      return res.status(200).json(response);
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new ElectionController();
