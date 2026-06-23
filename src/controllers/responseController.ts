import ResponseRepository from "../repositories/ResponseRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";

class ResponseController {
  async createResponse(req: Request, res: Response) {
    try {
      const {
        response,
        ticketId,
        wishlistId,
        taskId,
        quoteId,
        initiativeId,
        user,
      } = req.body;

      const newResponse = await ResponseRepository.createResponse({
        response,
        ...(ticketId && { ticketId: Number(ticketId) }),
        ...(wishlistId && { wishlistId: Number(wishlistId) }),
        ...(taskId && { taskId: Number(taskId) }),
        ...(quoteId && { quoteId: Number(quoteId) }),
        ...(initiativeId && { initiativeId: Number(initiativeId) }),
        userId: Number(user.id),
      });

      return res.status(201).json({
        message: "Response added successfully",
        data: newResponse,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getResponseById(req: Request, res: Response) {
    try {
      const { responseId } = req.params;

      const response = await ResponseRepository.getResponseById(
        Number(responseId),
      );

      if (!response) {
        return res.status(404).json({
          error: [
            {
              path: "responseId",
              message:
                "We couldn’t find a response with this ID. Please check the ID and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Response fetched successfully",
        data: response,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getResponsesByAssociation(req: Request, res: Response) {
    try {
      const { ticketId, wishlistId, taskId, quoteId, initiativeId } =
        req.params;
      const {
        pagination: { page, limit },
      } = req.body;

      const { responses, totalCount } = await ResponseRepository.getResponses(
        page,
        limit,
        {
          ...(ticketId && { ticketId: Number(ticketId) }),
          ...(wishlistId && { wishlistId: Number(wishlistId) }),
          ...(taskId && { taskId: Number(taskId) }),
          ...(quoteId && { quoteId: Number(quoteId) }),
          ...(initiativeId && { initiativeId: Number(initiativeId) }),
        },
      );

      const response: PaginationResponse = {
        message: "Responses fetched successfully.",
        data: responses,
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

  async deleteResponse(req: Request, res: Response) {
    try {
      const { responseId } = req.params;

      const response = await ResponseRepository.deleteResponse(
        Number(responseId),
      );

      return res.status(200).json({
        message: "Response has been removed",
        data: response,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new ResponseController();
