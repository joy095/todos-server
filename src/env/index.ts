/**
 * Retrieves an environment variable or throws an error if it is missing.
 */
function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;

  if (!value) {
    throw new Error(
      `Environment variable Missing: "${key}" is required but was not found.`,
    );
  }

  return value;
}

export const PORT = getEnv("PORT", "5000");
export const BETTER_AUTH_SECRET = getEnv("BETTER_AUTH_SECRET");
export const BETTER_AUTH_URL = getEnv("BETTER_AUTH_URL");
export const MONGODB_URI = getEnv("MONGODB_URI");
export const NODE_ENV = getEnv("NODE_ENV", "development");
export const ORIGIN = getEnv("ORIGIN", "http://localhost:5173");
