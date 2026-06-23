import initiativeRepository from "../repositories/initiativeRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { InitiativeStatus } from "../common/enums";

class InitiativeController {
  async addInitiative(req: Request, res: Response) {
    const { title, description, user } = req.body;

    try {
      const newInitiative = await initiativeRepository.createInitiative({
        title,
        description,
        userId: Number(user.id),
        status: InitiativeStatus.PLANNED,
      });

      return res.status(201).json({
        message: "Initiative created successfully",
        data: newInitiative,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getInitiatives(req: Request, res: Response) {
    try {
      const {
        pagination: { page, limit },
      } = req.body;
      const { status } = req.query;

      const { initiatives, totalCount } =
        await initiativeRepository.getAllInitiatives(
          page,
          limit,
          status as InitiativeStatus | undefined,
        );

      const response: PaginationResponse = {
        message: "Initiatives fetched successfully",
        data: initiatives,
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

  async getUserInitiatives(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { page, limit } = req.body.pagination;

      const { initiatives, totalCount } =
        await initiativeRepository.getAllInitiatives(
          page,
          limit,
          undefined,
          Number(userId),
        );

      const response: PaginationResponse = {
        message: "User initiatives fetched successfully",
        data: initiatives,
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

  async getInitiativeById(req: Request, res: Response) {
    try {
      const { initiativeId } = req.params;
      const initiative = await initiativeRepository.getInitiativeById(
        Number(initiativeId),
      );

      if (!initiative) {
        return res.status(404).json({
          error: [
            {
              path: "initiativeId",
              msg: "We couldn't find an initiative with the ID you provided. Please check the ID and try again",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Initiative fetched successfully",
        data: initiative,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyInitiatives(req: Request, res: Response) {
    try {
      const {
        user,
        pagination: { page, limit },
      } = req.body;

      const { initiatives, totalCount } =
        await initiativeRepository.getAllInitiatives(
          page,
          limit,
          undefined,
          Number(user.id),
        );

      const response: PaginationResponse = {
        message: "Your initiatives fetched successfully",
        data: initiatives,
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

  async updateInitiativeStatus(req: Request, res: Response) {
    try {
      const { initiativeId } = req.params;
      const { status } = req.body;

      const updatedInitiative = await initiativeRepository.updateInitiative(
        Number(initiativeId),
        { status },
      );

      return res.status(206).json({
        message: "Initiative status updated successfully",
        data: updatedInitiative,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateInitiative(req: Request, res: Response) {
    try {
      const { initiativeId } = req.params;
      const { title, description } = req.body;

      const updatedInitiative = await initiativeRepository.updateInitiative(
        Number(initiativeId),
        { title, description },
      );

      return res.status(200).json({
        message: "Initiative updated successfully",
        data: updatedInitiative,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async deleteInitiative(req: Request, res: Response) {
    try {
      const { initiativeId } = req.params;

      const deletedInitiative = await initiativeRepository.deleteInitiative(
        Number(initiativeId),
      );

      return res.status(200).json({
        message: "Initiative has been removed",
        data: deletedInitiative,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new InitiativeController();
