import { collections } from "../db";
import { logger } from "../utils/logger";

export async function createIndexes() {
  await collections.tasks.createIndexes([
    {
      key: {
        userId: 1,
        createdAt: -1,
      },
      name: "user_createdAt_idx",
    },
    {
      key: {
        userId: 1,
        status: 1,
      },
      name: "user_status_idx",
    },
    {
      key: {
        title: "text",
        description: "text",
      },
      name: "task_search_idx",
    },
  ]);

  logger.info("MongoDB indexes created");
}
