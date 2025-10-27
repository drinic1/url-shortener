// import config from "../../../utils/config.js";
import { ForbiddenError, NotFoundError } from "../../../errors.js";
import { UrlEntry } from "../../../types/inMemory.js";
import { NewUrl } from "../../../types/incoming.js";
import { getUserById } from "./userService.js";
import { IUrlStorage } from "../../interfaces/IUrlStorage.js";
import { urls, users } from "./dataSource.js";

export default class InMemoryUrlService implements IUrlStorage {
  async getByAlias(alias: string): Promise<UrlEntry | undefined> {
    return Promise.resolve(urls.find((entry) => entry.alias === alias));
  }

  async createEntry(newUrl: NewUrl, userId: string): Promise<UrlEntry> {
    const newUrlEntry = {
      id: crypto.randomUUID(),
      // domain: config.BACKEND_ORIGIN,
      ...newUrl,
      updated: new Date(),
      userId,
    } as UrlEntry;
    const user = await getUserById(userId);
    if (!user) throw new NotFoundError("User with the specified ID not found.");

    user.urls.push(newUrlEntry);
    urls.push(newUrlEntry);
    console.log(users[0]);
    console.log(urls);
    return newUrlEntry;
  }

  async updateAlias(id: string, alias: string, userId: string): Promise<void> {
    const { entry, userUrl } = await validateExistanceAndOwnership(id, userId);

    userUrl.alias = alias;
    entry.alias = alias;
    entry.updated = new Date();
  }

  async deleteEntry(id: string, userId: string): Promise<boolean> {
    const { user } = await validateExistanceAndOwnership(id, userId);

    let index = user.urls.findIndex((url) => url.id === id);
    if (index == -1) return false;
    user.urls.splice(index, 1);

    index = urls.findIndex((entry) => entry.id === id);
    if (index == -1) return false;
    urls.splice(index, 1);
    console.log(users[0]);
    console.log(urls);
    return true;
  }

  async getUniqueAlias(): Promise<string> {
    let alias = "";
    let isUnique = false;
    while (!isUnique) {
      alias = crypto.randomUUID().substring(0, 8);
      if (!(await this.getByAlias(alias))) isUnique = true;
    }
    return alias;
  }
}

const getById = (id: string) => {
  return Promise.resolve(urls.find((entry) => entry.id === id));
};

const validateExistanceAndOwnership = async (urlId: string, userId: string) => {
  const entry = await getById(urlId);
  if (!entry)
    throw new NotFoundError("The entry with the specified ID doesn't exist.");
  if (entry.userId !== userId)
    throw new ForbiddenError("The entry is owned by another user.");

  const user = await getUserById(userId);
  if (!user) throw new NotFoundError("User with the specified ID not found.");

  const userUrl = user.urls.find((url) => url.id === urlId);
  //shouldn't occur if the create was atomic
  if (!userUrl)
    throw new NotFoundError("The entry with the specified ID doesn't exist.");

  return { entry, user, userUrl };
};
