import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import cors from "cors";
import { ORIGIN, PORT } from "./env";
import { httpLogger } from "./middlewares/logger.middleware";
import taskRoutes from "./routes/task.routes";

const app = express();
const port = PORT;

app.use(httpLogger);

// Configure CORS middleware
app.use(
  cors({
    origin: ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], // Specify allowed HTTP methods
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
);

app.all("/api/auth/*splat", toNodeHandler(auth)); // For ExpressJS v5

app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV ?? "development",
    version: process.env.npm_package_version ?? "unknown",
  });
});

export default app;
