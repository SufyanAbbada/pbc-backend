import prisma from "../config/prismaClient";
import { Task } from "../common/types";
import { TaskStatus } from "../common/enums";
import { calculatePaginationSkip } from "../utils/calculatePaginationSkip";

class TaskRepository {
  async createTask(taskData: Task) {
    return await prisma.task.create({
      data: taskData,
    });
  }

  async getTaskById(taskId: number) {
    return await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assigner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        responses: {
          include: {
            user: { select: { id: true, name: true, Role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async getTasksByAssignee(
    assigneeId: number,
    page?: number,
    limit?: number,
    status?: TaskStatus,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const whereClause = {
      ...(status && { status }),
      ...(assigneeId && { assignees: { some: { id: assigneeId } } }),
    };

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          assignees: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assigner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where: whereClause }),
    ]);

    return { tasks, totalCount };
  }

  async getTasksByAssigner(
    assignerId: number,
    page?: number,
    limit?: number,
    status?: TaskStatus,
  ) {
    const skip = calculatePaginationSkip(page, limit);

    const whereClause: { assignerId: number; status?: TaskStatus } = {
      assignerId,
    };
    if (status) {
      whereClause.status = status;
    }

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          assignees: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assigner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where: whereClause }),
    ]);

    return { tasks, totalCount };
  }

  async getAllTasks(page?: number, limit?: number, status?: TaskStatus) {
    const skip = calculatePaginationSkip(page, limit);

    const whereClause = status ? { status } : {};

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where: whereClause,
        include: {
          assignees: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          assigner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.task.count({ where: whereClause }),
    ]);

    return { tasks, totalCount };
  }

  async updateTask(taskId: number, taskData: Partial<Task>) {
    return await prisma.task.update({
      where: { id: taskId },
      data: taskData,
      include: {
        assignees: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        assigner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        responses: {
          include: {
            user: { select: { id: true, name: true, Role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });
  }

  async getTaskByIdAndUserId(taskId: number, userId: number) {
    const task = await prisma.task.findUnique({
      where: { id: taskId, assignerId: userId },
      include: {
        responses: {
          include: {
            user: { select: { id: true, name: true, Role: true } },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return !!task;
  }

  async deleteTask(taskId: number) {
    return await prisma.task.delete({
      where: { id: taskId },
    });
  }
}

export default new TaskRepository();
