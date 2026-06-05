import "dotenv/config";
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt, openAPI } from "better-auth/plugins";
import { db, dbClient } from "../db";
import { ORIGIN } from "../env";

export const auth = betterAuth({
  experimental: { joins: true },

  database: mongodbAdapter(db, { client: dbClient }),

  rateLimit: {
    enabled: false,
    window: 60,
    max: 100,
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  plugins: [
    // ...(process.env.NODE_ENV === "development" ? [openAPI()] : []),
    openAPI(),
    jwt({
      jwks: {
        keyPairConfig: { alg: "EdDSA" }, // "EdDSA" | "ES256" | "ES512" | "PS256" | "RS256"
        rotationInterval: 60 * 60 * 24 * 30,
        gracePeriod: 60 * 60 * 24 * 20,
      },
      jwt: {
        expirationTime: "15m",
      },
    }),
  ],

  trustedOrigins: [ORIGIN],

  advanced: {
    disableCSRFCheck: true, // ⚠️ Only for testing!
  },
});

// Inferred types
export type User = typeof auth.$Infer.Session.user;
export type Session = typeof auth.$Infer.Session.session;
