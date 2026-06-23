import TicketCategoryRepository from "../repositories/TicketCategoryRepository";
import generateSlug from "../utils/nameToSlugConverter";
import generalErrorResponse from "../utils/generalErrorResponse";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { Request, Response } from "express";
import { CategoryType } from "../common/enums";

class TicketCategoryController {
  async addTicketCategory(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const ticketCategory = await TicketCategoryRepository.addTicketCategory({
        name,
        slug: await generateSlug(name, CategoryType.TICKET),
      });

      return res.status(201).json({
        message: "Ticket category created successfully",
        data: ticketCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllTicketCategories(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;

      const { ticketCategories, totalCount } =
        await TicketCategoryRepository.getAllTicketCategories(page, limit);

      const response: PaginationResponse = {
        message: "Ticket categories fetched successfully",
        data: ticketCategories,
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

  async getTicketCategoryById(req: Request, res: Response) {
    try {
      const { ticketCategoryId } = req.params;
      const ticketCategory =
        await TicketCategoryRepository.getTicketCategoryById(
          Number(ticketCategoryId),
        );

      return res.status(200).json({
        message: "Ticket category fetched successfully",
        data: ticketCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTicketCategory(req: Request, res: Response) {
    try {
      const { ticketCategoryId } = req.params;
      const { name } = req.body;

      const updatedTicketCategory =
        await TicketCategoryRepository.updateTicketCategory(
          Number(ticketCategoryId),
          {
            name,
            slug: await generateSlug(name, CategoryType.TICKET),
          },
        );

      return res.status(206).json({
        message: "Ticket category updated successfully",
        data: updatedTicketCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteTicketCategory(req: Request, res: Response) {
    try {
      const { ticketCategoryId } = req.params;

      const deletedCategory =
        await TicketCategoryRepository.deleteTicketCategory(
          Number(ticketCategoryId),
        );

      return res.status(200).json({
        message: "Ticket category has been removed",
        data: deletedCategory,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new TicketCategoryController();
