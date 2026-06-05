import { MongoClient } from "mongodb";
import { MONGODB_URI } from "../env";
import { logger } from "../utils/logger";
import type {
  AccountDoc,
  SessionDoc,
  UserDoc,
  VerificationDoc,
} from "../types/auth";
import type { TaskDoc } from "../types/task";
import { createIndexes } from "./dbIndex";

const uri = MONGODB_URI;

let client: MongoClient;

if (process.env.NODE_ENV === "development") {
  // Preserve the connection across HMR reloads in development
  let globalWithMongo = global as typeof globalThis & {
    _mongoClient?: MongoClient;
  };

  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri);
  }
  client = globalWithMongo._mongoClient;
} else {
  // Use a standard client in production
  client = new MongoClient(uri);
}

// Initialize `db` immediately after `client` is assigned
const db = client.db();

async function connectDB() {
  try {
    await client.connect();

    logger.info("Database connection established successfully", {
      database: db.databaseName, // Access via the initialized `db`
    });

    await createIndexes();
  } catch (error) {
    logger.error("Failed to connect to the database", {
      error: error instanceof Error ? error.message : String(error),
      code: "DB_CONNECTION_ERROR",
    });
  }
}

connectDB();

// Type-safe collection access
export const collections = {
  users: db.collection<UserDoc>("user"),
  sessions: db.collection<SessionDoc>("session"),
  accounts: db.collection<AccountDoc>("account"),
  verifications: db.collection<VerificationDoc>("verification"),

  tasks: db.collection<TaskDoc>("task"),
};

export const dbClient = client;
export { db };
