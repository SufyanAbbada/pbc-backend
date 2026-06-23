import TaskRepository from "../repositories/TaskRepository";
import generalErrorResponse from "../utils/generalErrorResponse";
import { Request, Response } from "express";
import { PaginationResponse } from "../common/types";
import { paginate } from "../utils/pagination";
import { TaskStatus } from "../common/enums";

class TaskController {
  async createTask(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        assignees,
        user: assigner,
        invalidAssigneeIds,
      } = req.body;

      const task = await TaskRepository.createTask({
        title,
        description,
        assignees: {
          connect: assignees.map((id: number) => ({ id })),
        },
        assignerId: Number(assigner.id),
        status: TaskStatus.PENDING,
      });

      let message = "Task has been created & assigned successfully";
      if (invalidAssigneeIds.length > 0) {
        message += `, but the following assignee IDs were invalid and not assigned: ${invalidAssigneeIds.join(", ")}`;
      }

      return res.status(201).json({
        message,
        data: task,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getTaskById(req: Request, res: Response) {
    try {
      const { taskId } = req.params;

      const task = await TaskRepository.getTaskById(Number(taskId));

      if (!task) {
        return res.status(404).json({
          error: [
            {
              path: "taskId",
              msg: "We couldn't find a task with the ID you provided. Please recheck the ID",
            },
          ],
        });
      }

      return res.status(200).json({
        message: "Task fetched successfully",
        data: task,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async getMyAssignedTasks(req: Request, res: Response) {
    try {
      const {
        user: { id },
        pagination: { page, limit },
      } = req.body;
      const { status } = req.query;

      const { tasks, totalCount } = await TaskRepository.getTasksByAssignee(
        Number(id),
        page,
        limit,
        status as TaskStatus | undefined,
      );

      const response: PaginationResponse = {
        message: "Tasks fetched successfully",
        data: tasks,
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

  async getMyCreatedTasks(req: Request, res: Response) {
    try {
      const {
        user: { id },
        pagination: { page, limit },
      } = req.body;
      const { status } = req.query;

      const { tasks, totalCount } = await TaskRepository.getTasksByAssigner(
        Number(id),
        page,
        limit,
        status as TaskStatus | undefined,
      );

      const response: PaginationResponse = {
        message: "Tasks created by you fetched successfully",
        data: tasks,
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

  async getAllTasks(req: Request, res: Response) {
    try {
      const { status } = req.query;
      const {
        pagination: { page, limit },
      } = req.body;

      const { tasks, totalCount } = await TaskRepository.getAllTasks(
        page,
        limit,
        status as TaskStatus | undefined,
      );

      const response: PaginationResponse = {
        message: "All tasks fetched successfully",
        data: tasks,
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

  async updateTaskStatus(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      const task = await TaskRepository.updateTask(Number(taskId), {
        status: status as TaskStatus,
      });

      return res.status(206).json({
        message: "Task status updated successfully",
        data: task,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }

  async updateTaskDetails(req: Request, res: Response) {
    try {
      const { taskId } = req.params;
      const { title, description } = req.body;

      const task = await TaskRepository.updateTask(Number(taskId), {
        title,
        description,
      });

      return res.status(206).json({
        message: "Task details updated successfully",
        data: task,
      });
    } catch (error: any) {
      return generalErrorResponse(error, res);
    }
  }
}

export default new TaskController();
