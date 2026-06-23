import PolicyRepository from "../repositories/policyRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { paginate } from "../utils/pagination";
import { PaginationResponse } from "../common/types";
import { GeneralStatus, PolicyType } from "../common/enums";

class PolicyController {
  async addPolicy(req: Request, res: Response) {
    try {
      const { title, description, user } = req.body;

      const policy = await PolicyRepository.addPolicy({
        userId: Number(user.id),
        title,
        description,
        type: PolicyType.POLICY,
        status: GeneralStatus.PENDING,
      });

      return res.status(201).json({
        message: "Policy created successfully",
        data: policy,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllPolicies(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { policies, totalCount } = await PolicyRepository.getAllPolicies(
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Categories fetched successfully",
        data: policies,
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

  async getPolicyById(req: Request, res: Response) {
    try {
      const { policyId } = req.params;
      const policy = await PolicyRepository.getPolicyById(Number(policyId));

      if (!policy) {
        return res.status(404).json({
          path: "policyId",
          message:
            "We couldn't find this policy in the system. Please recheck policy ID",
        });
      }

      return res.status(200).json({
        message: "Policy fetched successfully",
        data: policy,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updatePolicy(req: Request, res: Response) {
    try {
      const { policyId } = req.params;
      const { title, description } = req.body;

      const updatedPolicy = await PolicyRepository.updatePolicy(
        Number(policyId),
        {
          title,
          description,
        },
      );

      return res.status(206).json({
        message: "Policy updated successfully",
        data: updatedPolicy,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deletePolicy(req: Request, res: Response) {
    try {
      const { policyId } = req.params;
      const deletedPolicy = await PolicyRepository.deletePolicy(
        Number(policyId),
      );

      return res.status(206).json({
        message: "Policy has been removed",
        data: deletedPolicy,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new PolicyController();
