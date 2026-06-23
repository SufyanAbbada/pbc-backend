import ConstitutionRepository from "../repositories/ConstitutionRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import policyRepository from "../repositories/policyRepository";
import electionRepository from "../repositories/electionRepository";
import {
  ElectionState,
  ElectionType,
  GeneralStatus,
  PolicyType,
} from "../common/enums";
import { Request, Response } from "express";
import { Election } from "../common/types";
import { DAY_PERIOD } from "../common/constants";

class ConstitutionController {
  async getConstitution(req: Request, res: Response) {
    try {
      const constitution = await ConstitutionRepository.getConstitution();

      return res.status(200).json({
        message: "Constitution Fetched Successfully",
        data: constitution,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async amendConstitution(req: Request, res: Response) {
    const { article, user, version, content, startDate, endDate } = req.body;

    try {
      const unamendedConstitution =
        await ConstitutionRepository.updateConstitution({
          isEditable: false,
        });

      const newPolicy = await policyRepository.addPolicy({
        userId: Number(user.id),
        title: article.title + unamendedConstitution.version,
        description: content,
        type: PolicyType.CONSTITUTION,
        status: GeneralStatus.PENDING,
        articleId: Number(article.id),
        newVersion: version,
      });

      const electionData: Election = {
        title: "Amendment of Constitution",
        description: "Amendment of " + article.title,
        type: ElectionType.POLICY_ELECTION,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        policyId: Number(newPolicy.id),
        state: ElectionState.ACTIVE,
      };

      const election = await electionRepository.addElection(electionData);

      return res.status(201).json({
        message: "Election for Constitution Amendment Created Successfully",
        data: {
          election,
          policy: newPolicy,
        },
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new ConstitutionController();
