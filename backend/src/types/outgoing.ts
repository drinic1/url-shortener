import { User } from "./inMemory";

export type UserPublicData = Omit<User, "passwordHash">;
