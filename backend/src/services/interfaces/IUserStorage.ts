import { UserRegistration } from "../../types/incoming";
import { UserPublicData } from "../../types/outgoing";

export interface IUserStorage {
  authenticate(mail: string, password: string): Promise<UserPublicData>;
  getById(id: string): Promise<UserPublicData | undefined>;
  addUser(user: UserRegistration): Promise<UserPublicData>;
}
