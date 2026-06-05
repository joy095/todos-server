import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

export const validate =
  (schema: ZodObject, source: "body" | "params" | "query" = "body") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req[source] = schema.parse(req[source]);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validation failed", {
          source,
          errors: error.flatten(),
        });

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: error.flatten(),
        });

        return;
      }

      next(error);
    }
  };
