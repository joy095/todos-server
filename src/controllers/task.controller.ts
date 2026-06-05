import type { RequestHandler } from "express";
import { collections } from "../db";
import { parseObjectId } from "../utils/object-id";
import { logger } from "../utils/logger";

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const createTask: RequestHandler = async (req, res) => {
  try {
    const { title, description } = req.body;

    const task = {
      title,
      description,
      status: "pending" as const,
      userId: req.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collections.tasks.insertOne(task);

    logger.info("Task created", {
      taskId: result.insertedId.toString(),
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      taskId: result.insertedId,
    });
  } catch (error) {
    logger.error("Failed to create task", {
      userId: req.user?.id,
      error: error instanceof Error ? error.message : error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to create task",
    });
  }
};

export const updateTask: RequestHandler = async (req, res) => {
  try {
    const taskId = parseObjectId(req.params.id);

    if (!taskId) {
      res.status(400).json({ success: false, message: "Invalid task id" });
      return;
    }

    const { title, description, status } = req.body;

    const updateFields: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;

    const result = await collections.tasks.updateOne(
      { _id: taskId, userId: req.user.id },
      { $set: updateFields },
    );

    if (!result.matchedCount) {
      res.status(404).json({ success: false, message: "Task not found" });
      return;
    }

    res.json({ success: true, message: "Task updated" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update task",
    });
  }
};

export const deleteTask: RequestHandler = async (req, res) => {
  try {
    const taskId = parseObjectId(req.params.id);

    if (!taskId) {
      res.status(400).json({
        success: false,
        message: "Invalid task id",
      });
      return;
    }

    const result = await collections.tasks.deleteOne({
      _id: taskId,
      userId: req.user.id,
    });

    if (!result.deletedCount) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });
      return;
    }

    logger.info("Task deleted", {
      taskId: taskId.toString(),
      userId: req.user.id,
    });

    res.json({
      success: true,
      message: "Task deleted",
    });
  } catch (error) {
    logger.error("Failed to delete task", {
      userId: req.user?.id,
      error: error instanceof Error ? error.message : error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to delete task",
    });
  }
};

export const toggleTaskStatus: RequestHandler = async (req, res) => {
  try {
    const taskId = parseObjectId(req.params.id);

    if (!taskId) {
      res.status(400).json({
        success: false,
        message: "Invalid task id",
      });

      return;
    }

    const task = await collections.tasks.findOne(
      {
        _id: taskId,
        userId: req.user.id,
      },
      {
        projection: {
          status: 1,
        },
      },
    );

    if (!task) {
      res.status(404).json({
        success: false,
        message: "Task not found",
      });

      return;
    }

    const newStatus = task.status === "completed" ? "pending" : "completed";

    await collections.tasks.updateOne(
      {
        _id: taskId,
      },
      {
        $set: {
          status: newStatus,
          updatedAt: new Date(),
        },
      },
    );

    res.json({
      success: true,
      status: newStatus,
    });
  } catch (error) {
    logger.error("Toggle task failed", {
      error: error instanceof Error ? error.message : error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to toggle task",
    });
  }
};

export const getTasks: RequestHandler = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Math.min(Number(req.query.limit ?? 10), 100);

    const q = typeof req.query.q === "string" ? req.query.q.trim() : undefined;

    const status =
      typeof req.query.status === "string" ? req.query.status : undefined;

    const sortBy =
      typeof req.query.sortBy === "string" ? req.query.sortBy : "createdAt";

    const order = req.query.order === "asc" ? 1 : -1;

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      userId: req.user.id,
    };

    if (status === "pending" || status === "completed") {
      filter.status = status;
    }

    if (q) {
      filter.$or = [
        {
          title: {
            $regex: escapeRegex(q),
            $options: "i",
          },
        },
        {
          description: {
            $regex: escapeRegex(q),
            $options: "i",
          },
        },
      ];
    }

    const [tasks, total] = await Promise.all([
      collections.tasks
        .find(filter)
        .project({
          title: 1,
          description: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
        })
        .sort({
          [sortBy]: order,
        })
        .skip(skip)
        .limit(limit)
        .toArray(),

      collections.tasks.countDocuments(filter),
    ]);

    res.json({
      success: true,

      data: tasks,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },

      filters: {
        q,
        status,
        sortBy,
        order: order === 1 ? "asc" : "desc",
      },
    });
  } catch (error) {
    logger.error("Failed to fetch tasks", {
      userId: req.user?.id,
      error: error instanceof Error ? error.message : error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks",
    });
  }
};

export const getTaskSuggestions: RequestHandler = async (req, res) => {
  try {
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

    if (q.length < 2) {
      res.json([]);
      return;
    }

    const tasks = await collections.tasks
      .find(
        {
          userId: req.user.id,
          title: {
            $regex: escapeRegex(q),
            $options: "i",
          },
        },
        {
          projection: {
            _id: 0,
            title: 1,
          },
        },
      )
      .limit(8)
      .toArray();

    const suggestions = [...new Set(tasks.map((task) => task.title))];

    res.json(suggestions);
  } catch (error) {
    logger.error("Failed to fetch task suggestions", {
      userId: req.user?.id,
      error: error instanceof Error ? error.message : error,
    });

    res.status(500).json({
      success: false,
      message: "Failed to fetch suggestions",
    });
  }
};
