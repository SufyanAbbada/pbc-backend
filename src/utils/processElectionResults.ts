import electionRepository from "../repositories/electionRepository";
import voteRepository from "../repositories/voteRepository";
import policyRepository from "../repositories/policyRepository";
import ConstitutionRepository from "../repositories/ConstitutionRepository";
import UserRepository from "../repositories/UserRepository";
import {
  ElectionState,
  ElectionType,
  GeneralStatus,
  MembershipCategory,
  PolicyType,
} from "../common/enums";
import {
  DEFAULT_VERSION,
  VOTER_PARTICIPATION_THRESHOLD,
} from "../common/constants";
import { Election, User, Vote } from "@prisma/client";
import { PolicyVoteType } from "../common/enums";

const calculateCandidateElectionWinner = (allVotes: Vote[]) => {
  const voteCountMap: Record<string, number> = {};

  for (const singleVote of allVotes) {
    voteCountMap[singleVote.vote] = (voteCountMap[singleVote.vote] || 0) + 1;
  }

  const maxVotes = Math.max(...Object.values(voteCountMap));

  const candidatesWithMaxVotes = Object.entries(voteCountMap).filter(
    ([_, votes]) => votes === maxVotes,
  );

  if (candidatesWithMaxVotes.length > 1) {
    return {
      isTie: true,
      tiedCandidates: candidatesWithMaxVotes.map(([candidateId]) =>
        Number(candidateId),
      ),
      voteCount: maxVotes,
    };
  }

  const winner = candidatesWithMaxVotes[0];
  return {
    isTie: false,
    electedId: Number(winner[0]),
    electedVotes: winner[1],
    allVotes: voteCountMap,
  };
};

const calculatePolicyElectionWinner = (
  allVotes: Array<Vote & { user: User }>,
): PolicyVoteType.UPVOTE | PolicyVoteType.DOWNVOTE => {
  let upVotes = 0;
  let downVotes = 0;

  for (const singleVote of allVotes) {
    if (singleVote.vote === PolicyVoteType.UPVOTE) upVotes++;
    else if (singleVote.vote === PolicyVoteType.DOWNVOTE) downVotes++;
  }

  if (upVotes >= downVotes) return PolicyVoteType.UPVOTE;
  if (downVotes > upVotes) return PolicyVoteType.DOWNVOTE;
  return PolicyVoteType.UPVOTE;
};

const calculatePollingElectionWinner = (allVotes: Vote[]) => {
  const voteCountMap: Record<string, number> = {};

  for (const singleVote of allVotes) {
    voteCountMap[singleVote.vote] = (voteCountMap[singleVote.vote] || 0) + 1;
  }

  const maxVotes = Math.max(...Object.values(voteCountMap));

  const optionsWithMaxVotes = Object.entries(voteCountMap).filter(
    ([_, votes]) => votes === maxVotes,
  );

  if (optionsWithMaxVotes.length > 1) {
    return {
      isTie: true,
      tiedOptions: optionsWithMaxVotes.map(([option]) => option),
      voteCount: maxVotes,
      voteCountMap,
    };
  }

  const winner = optionsWithMaxVotes[0];
  return {
    isTie: false,
    winningOption: winner[0],
    winningPollVotes: winner[1],
    voteCountMap,
  };
};

async function handleUnsuccessfulElection(election: Election, outcome: string) {
  const results = await electionRepository.updateElection(election.id, {
    outcome,
    state: ElectionState.UNSUCCESSFUL,
  });

  if (election.type === ElectionType.POLICY_ELECTION && election.policyId) {
    await policyRepository.updatePolicy(election.policyId, {
      status: GeneralStatus.REJECTED,
    });

    const policy = await policyRepository.getPolicyById(election.policyId);
    if (policy && policy.type === PolicyType.CONSTITUTION) {
      await ConstitutionRepository.updateConstitution({
        isEditable: true,
      });
    }
  }

  return {
    type: election.type,
    result: results,
  };
}

export async function processElectionResults(electionId: number) {
  const election = await electionRepository.getElectionById(electionId);
  if (!election) {
    throw new Error(`Election with ID ${electionId} not found`);
  }

  const allVotes = await voteRepository.getAllVotesByElectionId(
    electionId,
    true,
  );

  if (allVotes.length === 0) {
    return handleUnsuccessfulElection(
      election,
      "Election unsuccessful. No votes were casted.",
    );
  }

  const { totalCount } = await UserRepository.findUsersByMembershipCategoryType(
    MembershipCategory.CATEGORY_A,
  );

  const requiredVotes = Math.floor(totalCount * VOTER_PARTICIPATION_THRESHOLD);

  if (allVotes.length < requiredVotes) {
    return handleUnsuccessfulElection(
      election,
      `Election unsuccessful. Insufficient votes: ${allVotes.length} were received, ${requiredVotes} many votes are required.`,
    );
  }

  if (election.type === ElectionType.CANDIDATE_ELECTION) {
    const result = calculateCandidateElectionWinner(allVotes);

    if (result.isTie) {
      return handleUnsuccessfulElection(
        election,
        `Election unsuccessful. Election resulted in a tie between candidates ${result.tiedCandidates?.join(", ") || ""} with ${result.voteCount} votes each. Retake of election is required.`,
      );
    }

    const results = await electionRepository.updateElection(electionId, {
      electedId: result.electedId,
      electedVotes: result.electedVotes,
      outcome: `Election successful. Candidate with ID ${result.electedId} has been elected with ${result.electedVotes} votes.`,
      state: ElectionState.SUCCESSFUL,
    });

    return {
      type: ElectionType.CANDIDATE_ELECTION,
      result: results,
    };
  }

  if (election.type === ElectionType.POLLING_ELECTION) {
    const result = calculatePollingElectionWinner(allVotes);

    if (result.isTie) {
      return handleUnsuccessfulElection(
        election,
        `Election unsuccessful. Poll resulted in a tie between options ${
          result.tiedOptions?.join(", ") || ""
        } with ${result.voteCount} votes each.`,
      );
    }

    const results = await electionRepository.updateElection(electionId, {
      pollOptions: election.pollOptions,
      winningOption: result.winningOption,
      winningPollVotes: Number(result.winningPollVotes),
      outcome: `Election successful. Option "${result.winningOption}" has won with ${result.winningPollVotes} votes.`,
      state: ElectionState.SUCCESSFUL,
    });

    return {
      type: ElectionType.POLLING_ELECTION,
      result: results,
    };
  }

  if (election.type === ElectionType.POLICY_ELECTION && election.policyId) {
    const policy = await policyRepository.getPolicyById(election.policyId);
    if (!policy) {
      throw new Error(`Policy with ID ${election.policyId} not found`);
    }

    const isConstitutionPolicy = policy.type === PolicyType.CONSTITUTION;
    const policyVotes = calculatePolicyElectionWinner(allVotes);

    const policyResult = await electionRepository.updateElection(electionId, {
      policyVotes,
      outcome: `Election successful. Policy has been ${
        policyVotes === PolicyVoteType.UPVOTE ? "approved" : "rejected"
      }.`,
      state: ElectionState.SUCCESSFUL,
    });

    await policyRepository.updatePolicy(election.policyId, {
      status:
        policyVotes === PolicyVoteType.UPVOTE
          ? GeneralStatus.APPROVED
          : GeneralStatus.REJECTED,
    });

    if (isConstitutionPolicy) {
      if (policyVotes === PolicyVoteType.UPVOTE) {
        await ConstitutionRepository.updateConstitution({
          isEditable: true,
          version: policy.newVersion || DEFAULT_VERSION.FILE_VERSION,
          lastEditedBy: policy.userId,
        });

        if (policy.articleId) {
          await ConstitutionRepository.updateArticle(policy.articleId, {
            content: policy.description,
          });
        }
      } else if (policyVotes === PolicyVoteType.DOWNVOTE) {
        await ConstitutionRepository.updateConstitution({
          isEditable: true,
        });
      }
    }

    return {
      type: ElectionType.POLICY_ELECTION,
      result: policyResult,
    };
  }

  throw new Error(
    `Unknown election type or missing policy ID for election ${electionId}`,
  );
}
