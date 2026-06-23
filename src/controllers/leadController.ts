import generalErrorResponse from "../utils/generalErrorResponse";
import leadRepository from "../repositories/leadRepository";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class LeadController {
  async getUserLead(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.body.pagination;

      const { leads, totalCount } = await leadRepository.getUserLead(
        Number(userId),
        false,
        page,
        limit,
      );
      const response: PaginationResponse = {
        message: "Leads Fetched Successfully.",
        data: leads,
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

  async getMyLeads(req: Request, res: Response) {
    try {
      const {
        user,
        pagination: { page, limit },
      } = req.body;

      const { leads, totalCount } = await leadRepository.getUserLead(
        user.id,
        true,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Your Leads Fetched Successfully.",
        data: leads,
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

  async getMyProductsLeads(req: Request, res: Response) {
    try {
      const {
        user,
        pagination: { page, limit },
      } = req.body;
      const { productId } = req.params;

      const { leads, totalCount } = await leadRepository.getUserProductLeads(
        user.id,
        Number(productId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Your Product Leads Fetched Successfully.",
        data: leads,
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

  async getAllLead(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { leads, totalCount } = await leadRepository.getAllLead(
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Leads Fetched Successfully.",
        data: leads,
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

  async searchLeads(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { leads, totalCount } = await leadRepository.searchLeads(
        search as string,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Search results for leads fetched successfully",
        data: leads,
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

export default new LeadController();
