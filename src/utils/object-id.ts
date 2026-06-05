import { ObjectId } from "mongodb";

export const parseObjectId = (id: unknown): ObjectId | null => {
  if (typeof id !== "string") {
    return null;
  }

  if (!ObjectId.isValid(id)) {
    return null;
  }

  return new ObjectId(id);
};
