import { z } from "zod";

export const taskStatusSchema = z.enum(["pending", "completed"]);

export const createTaskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),

  description: z
    .string()
    .trim()
    .min(3, "Description must be at least 3 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(3).max(100).optional(),

    description: z.string().trim().min(3).max(2000).optional(),

    status: z.enum(["pending", "completed"]).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

export const taskIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid task id"),
});

export const taskQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().min(1).max(100).default(10),

  q: z.string().trim().optional(),

  status: z.enum(["pending", "completed"]).optional(),

  sortBy: z.enum(["createdAt", "updatedAt", "title"]).default("createdAt"),

  order: z.enum(["asc", "desc"]).default("desc"),
});

export type TaskQueryInput = z.infer<typeof taskQuerySchema>;

export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
