import BusinessGroupRepository from "../repositories/BusinessGroupRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class BusinessGroupController {
  async createBusinessGroup(req: Request, res: Response) {
    try {
      const { name, description } = req.body;

      const businessGroup = await BusinessGroupRepository.createBusinessGroup({
        name,
        description,
      });

      return res.status(201).json({
        message: "Business group created successfully",
        data: businessGroup,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllBusinessGroups(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { businessGroups, totalCount } =
        await BusinessGroupRepository.getAllBusinessGroups(page, limit);

      const response: PaginationResponse = {
        message: "Business groups fetched successfully",
        data: businessGroups,
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

  async getBusinessGroupById(req: Request, res: Response) {
    try {
      const { businessGroupId } = req.params;

      const businessGroup = await BusinessGroupRepository.getBusinessGroupById(
        Number(businessGroupId),
      );

      if (!businessGroup) {
        return res.status(404).json({
          error: [
            {
              path: "businessGroupId",
              message: "Business group not found",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Business group fetched successfully",
        data: businessGroup,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateBusinessGroup(req: Request, res: Response) {
    try {
      const { businessGroupId } = req.params;
      const { name, description } = req.body;

      const updatedBusinessGroup =
        await BusinessGroupRepository.updateBusinessGroup(
          Number(businessGroupId),
          { name, description },
        );

      return res.status(200).json({
        message: "Business group updated successfully",
        data: updatedBusinessGroup,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteBusinessGroup(req: Request, res: Response) {
    try {
      const { businessGroupId } = req.params;

      await BusinessGroupRepository.deleteBusinessGroup(
        Number(businessGroupId),
      );

      return res.status(200).json({
        message: "Business group has been removed",
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new BusinessGroupController();
