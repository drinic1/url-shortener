import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors.js";
import { User } from "../../../types/inMemory.js";
import { UserPublicData } from "../../../types/outgoing.js";
import { UserRegistration } from "../../../types/incoming.js";
import bcrypt from "bcrypt";
import { IUserStorage } from "../../interfaces/IUserStorage.js";
import { users } from "./dataSource.js";

export default class InMemoryUserService implements IUserStorage {
  async authenticate(mail: string, password: string): Promise<UserPublicData> {
    const user = await getByEmail(mail);
    if (!user) {
      throw new UnauthorizedError("Login unsuccessful. Wrong credentials.");
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedError("Login unsuccessful. Wrong credentials.");
    }
    return getUserPublicData(user);
  }

  getById(id: string): Promise<UserPublicData | undefined> {
    const matchedUser = users.find((user) => user.id === id);
    if (!matchedUser)
      throw new NotFoundError("User with the specified ID not found.");
    return Promise.resolve(getUserPublicData(matchedUser));
  }

  async addUser(user: UserRegistration): Promise<UserPublicData> {
    if (await getByUsername(user.username))
      throw new ConflictError("Username already taken.");
    if (await getByEmail(user.email))
      throw new ConflictError(
        "Email already taken. Choose a different one, or try signing in if this is your email."
      );
    const passwordHash = await bcrypt.hash(user.password, NUMBER_OR_ROUNDS);
    const newUser = {
      id: crypto.randomUUID(),
      username: user.username,
      email: user.email,
      passwordHash: passwordHash,
      urls: [],
    } as User;
    users.push(newUser);
    console.log(users);
    return getUserPublicData(newUser);
  }
}

const NUMBER_OR_ROUNDS = 10;

const getByEmail = (email: string) => {
  return Promise.resolve(users.find((user) => user.email === email));
};

const getByUsername = (username: string) => {
  return Promise.resolve(users.find((user) => user.username === username));
};

const getUserPublicData = (user: User): UserPublicData => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...publicData } = user;
  return publicData;
};

export const getUserById = (id: string): Promise<User | undefined> => {
  const matchedUser = users.find((user) => user.id === id);
  if (!matchedUser)
    throw new NotFoundError("User with the specified ID not found.");
  return Promise.resolve(matchedUser);
};
