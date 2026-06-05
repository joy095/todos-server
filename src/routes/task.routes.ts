import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";

import {
  createTaskSchema,
  updateTaskSchema,
  taskIdParamsSchema,
} from "../schemas/task.schema";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskStatus,
  getTaskSuggestions,
} from "../controllers/task.controller";

const router = Router();

router.use(requireAuth);

router.post("/", validate(createTaskSchema), createTask);

router.get("/", getTasks);

router.get(
  "/suggestions",
  getTaskSuggestions,
);

router.patch(
  "/:id",
  validate(taskIdParamsSchema, "params"),
  validate(updateTaskSchema),
  updateTask,
);

router.delete("/:id", validate(taskIdParamsSchema, "params"), deleteTask);

router.patch(
  "/:id/toggle",
  validate(taskIdParamsSchema, "params"),
  toggleTaskStatus,
);

export default router;
