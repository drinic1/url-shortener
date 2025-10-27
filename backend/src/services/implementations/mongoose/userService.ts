import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "../../../errors.js";
import { UserRegistration } from "../../../types/incoming.js";
import bcrypt from "bcrypt";
import UserModel from "../../../models/user.js";
import {
  PopulatedUserDocument,
  UrlDocument,
  UserDocument,
} from "../../../types/mongoose.js";
import { UserPublicData } from "../../../types/outgoing.js";
import { UrlEntry } from "../../../types/inMemory.js";
import { IUserStorage } from "../../interfaces/IUserStorage.js";

export default class MongooseUserService implements IUserStorage {
  async getById(id: string): Promise<UserPublicData | undefined> {
    const user = await UserModel.findById(id).populate<{ urls: UrlDocument[] }>(
      "urls"
    );
    if (!user) throw new NotFoundError("User with the specified ID not found.");
    return getDto(user);
  }

  async addUser(user: UserRegistration): Promise<UserPublicData> {
    if (await getByUsernameUnpopulated(user.username))
      throw new ConflictError("Username already taken.");
    if (await getByEmail(user.email))
      throw new ConflictError(
        "Email already taken. Choose a different one, or try signing in if this is your email."
      );
    const passwordHash = await bcrypt.hash(user.password, NUMBER_OR_ROUNDS);

    const emptyArray: UrlEntry[] = [];
    const newUser = new UserModel({
      username: user.username,
      email: user.email,
      passwordHash: passwordHash,
      urls: emptyArray,
    });
    const savedUser = await newUser.save();
    return getDto(savedUser);
  }

  async authenticate(mail: string, password: string): Promise<UserPublicData> {
    const user = await getByEmail(mail);
    if (!user) {
      throw new UnauthorizedError("Login unsuccessful. Wrong credentials.");
    }
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      throw new UnauthorizedError("Login unsuccessful. Wrong credentials.");
    }
    return getDto(user);
  }
}

const NUMBER_OR_ROUNDS = 10;

const getUserByIdUnpopulated = async (
  id: string
): Promise<UserDocument | null> => {
  return UserModel.findById(id);
};

const getByEmail = async (email: string) => {
  return UserModel.findOne({ email: email }).populate<{
    urls: UrlDocument[];
  }>("urls");
};

const getByUsernameUnpopulated = async (username: string) => {
  return UserModel.findOne({ username: username });
};

const getDto = (user: UserDocument | PopulatedUserDocument): UserPublicData => {
  let urlEntries: UrlEntry[];
  if (areUrlsPopulated(user)) {
    urlEntries = user.urls.map((urlDoc) => {
      const { _id, url, alias, updated, userId } = urlDoc; //, domain
      return {
        id: _id.toString(),
        userId: userId.toString(),
        url,
        // domain,
        alias,
        updated,
      };
    });
  } else {
    urlEntries = [];
  }

  const { _id, username, email } = user;

  return { id: _id.toString(), username, email, urls: urlEntries };
};

const areUrlsPopulated = (
  obj: UserDocument | PopulatedUserDocument
): obj is PopulatedUserDocument => {
  return obj.populated("urls") != undefined;
};

export { getUserByIdUnpopulated };
