import type { Request } from "express";
import type { Session, User } from "better-auth";

export interface AuthRequest extends Request {
  user: User;
  session: Session;
}
