import type { NextFunction, Request, Response } from "express";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
  // 1. Record the exact start time using Node's high-resolution timer
  const start = process.hrtime();

  // 2. Wait for the response to finish before logging
  res.on("finish", () => {
    // Calculate the time difference
    const diff = process.hrtime(start);
    // Convert to milliseconds
    const timeInMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);

    const method = req.method;
    const url = req.originalUrl;
    const status = res.statusCode;

    // Optional: Add terminal colors based on status code (like Morgan's 'dev' format)
    let statusColor = "\x1b[32m"; // Green for 200s
    if (status >= 500)
      statusColor = "\x1b[31m"; // Red for Server Errors
    else if (status >= 400)
      statusColor = "\x1b[33m"; // Yellow for Client Errors
    else if (status >= 300) statusColor = "\x1b[36m"; // Cyan for Redirects
    const resetColor = "\x1b[0m";

    // 3. Print the formatted log
    console.log(
      `${method} ${url} ${statusColor}${status}${resetColor} - ${timeInMs} ms`,
    );
  });

  // Pass control to the next middleware/route handler
  next();
};
