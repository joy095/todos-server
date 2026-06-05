// Define the allowed log levels
export type LogLevel = "info" | "warn" | "error";

// Define the exact schema every log must follow
export interface LogEntry {
  level: LogLevel;
  message: string;
  // Optional context object for extra debugging data
  context?: Record<string, unknown>;
  timestamp: string;
}

class Logger {
  private formatLog(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
  ): LogEntry {
    return {
      level,
      message,
      context,
      timestamp: new Date().toISOString(),
    };
  }

  info(message: string, context?: Record<string, unknown>) {
    const log = this.formatLog("info", message, context);
    console.log(JSON.stringify(log));
  }

  warn(message: string, context?: Record<string, unknown>) {
    const log = this.formatLog("warn", message, context);
    console.warn(JSON.stringify(log));
  }

  error(message: string, context?: Record<string, unknown>) {
    const log = this.formatLog("error", message, context);
    console.error(JSON.stringify(log));
  }
}

export const logger = new Logger();
