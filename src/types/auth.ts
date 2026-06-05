import { ObjectId, type Document } from "mongodb";
import type { auth } from "../lib/auth";

// Infer base types from Better Auth
type AuthUser = typeof auth.$Infer.Session.user;
type AuthSession = typeof auth.$Infer.Session.session;

// Extend with MongoDB-specific types (_id as ObjectId)
export interface UserDoc extends Omit<AuthUser, "id">, Document {
  _id: ObjectId;
  id: string; // Better Auth uses string IDs
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Add additional fields here
  role?: string;
}

export interface SessionDoc
  extends Omit<AuthSession, "id" | "userId">, Document {
  _id: ObjectId;
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccountDoc extends Document {
  _id: ObjectId;
  id: string;
  userId: string;
  accountId: string;
  providerId: string;
  accessToken?: string | null;
  refreshToken?: string | null;
  accessTokenExpiresAt?: Date | null;
  refreshTokenExpiresAt?: Date | null;
  scope?: string | null;
  idToken?: string | null;
  password?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface VerificationDoc extends Document {
  _id: ObjectId;
  id: string;
  identifier: string;
  value: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
