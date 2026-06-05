import { ObjectId } from "mongodb";

export type TaskStatus = "pending" | "completed";

export interface TaskDoc {
  _id?: ObjectId;
  title: string;
  description: string;
  status: TaskStatus;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
