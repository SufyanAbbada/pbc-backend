import ticketRepository from "../repositories/ticketRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import s3Service from "../services/s3Service";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { TicketPriority, TicketStatus } from "../common/enums";

class TicketController {
  async createTicket(req: Request, res: Response) {
    const {
      title,
      description,
      priority,
      ticketCategoryId,
      primaryImage,
      secondaryImage,
      tertiaryImage,
      user,
    } = req.body;

    try {
      const newTicket = await ticketRepository.createTicket({
        title,
        description,
        status: TicketStatus.OPEN,
        priority,
        userId: Number(user.id),
        categoryId: Number(ticketCategoryId),
        primaryImage: primaryImage
          ? await s3Service.uploadAsset(primaryImage)
          : undefined,
        secondaryImage: secondaryImage
          ? await s3Service.uploadAsset(secondaryImage)
          : undefined,
        tertiaryImage: tertiaryImage
          ? await s3Service.uploadAsset(tertiaryImage)
          : undefined,
      });

      return res.status(201).json({
        message: "Ticket created successfully",
        data: newTicket,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getAllTickets(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { status, priority } = req.query;

      const { tickets, totalCount } = await ticketRepository.getAllTickets(
        page,
        limit,
        status as TicketStatus | undefined,
        priority as TicketPriority | undefined,
      );

      const response: PaginationResponse = {
        message: "Tickets fetched successfully",
        data: tickets,
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

  async getUserTickets(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
        user,
      } = req.body;
      const userId = req.params.userId || user.id;

      const { tickets, totalCount } = await ticketRepository.getTicketsByUserId(
        Number(userId),
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "User tickets fetched successfully",
        data: tickets,
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

  async getTicketById(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const ticket = await ticketRepository.getTicketById(
        Number(ticketId),
        true,
      );

      if (!ticket) {
        return res.status(404).json({
          error: [
            {
              path: "ticketId",
              message: "Ticket with the given Id is not found.",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Ticket fetched successfully",
        data: ticket,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTicketStatus(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const { status } = req.body;

      const updatedTicket = await ticketRepository.updateTicket(
        Number(ticketId),
        {
          status,
        },
      );

      return res.status(206).json({
        message: "Ticket status updated successfully",
        data: updatedTicket,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTicket(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;
      const { title, description, priority } = req.body;

      const updatedTicket = await ticketRepository.updateTicket(
        Number(ticketId),
        { title, description, priority },
      );

      return res.status(206).json({
        message: "Ticket updated successfully",
        data: updatedTicket,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteTicket(req: Request, res: Response) {
    try {
      const { ticketId } = req.params;

      const deletedTicket = await ticketRepository.deleteTicket(
        Number(ticketId),
      );

      return res.status(200).json({
        message: "Ticket has been removed",
        data: deletedTicket,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async searchTickets(req: Request, res: Response) {
    try {
      const { page, limit } = req.body.pagination;
      const { search } = req.query;

      const { tickets, totalCount } = await ticketRepository.searchTickets(
        search as string,
        page,
        limit,
      );

      const response: PaginationResponse = {
        message: "Search results for tickets fetched successfully",
        data: tickets,
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

export default new TicketController();
