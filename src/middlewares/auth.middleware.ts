import type { RequestHandler } from "express";
import { auth } from "../lib/auth";
import { logger } from "../utils/logger";

export const requireAuth: RequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session) {
      logger.warn("Unauthorized access attempt", {
        path: req.originalUrl,
        method: req.method,
      });

      res.status(401).json({
        success: false,
        message: "Authentication required",
      });

      return;
    }

    req.user = session.user;
    req.session = session.session;

    next();
  } catch (error) {
    logger.error("Authentication middleware failed", {
      error: error instanceof Error ? error.message : error,
    });

    res.status(401).json({
      success: false,
      message: "Invalid session",
    });
  }
};