// import config from "../../../utils/config.js";
import { ForbiddenError, NotFoundError, QuotaError } from "../../../errors.js";
import { getUserByIdUnpopulated } from "./userService.js";
import UrlModel from "../../../models/url.js";
import { NewUrl } from "../../../types/incoming.js";
import mongoose from "mongoose";
import { UrlEntry } from "../../../types/inMemory.js";
import { IUrlStorage } from "../../interfaces/IUrlStorage.js";
import { UrlDocument } from "../../../types/mongoose.js";

export default class MongooseUrlService implements IUrlStorage {
  async getByAlias(alias: string): Promise<UrlEntry | undefined> {
    const matchedUrl = await UrlModel.findOne({ alias: alias });
    if (!matchedUrl) return undefined;
    return getDto(matchedUrl);
  }

  async createEntry(newUrl: NewUrl, userId: string): Promise<UrlEntry> {
    const user = await getUserByIdUnpopulated(userId);
    if (!user) throw new NotFoundError("User with the specified ID not found.");

    if (user.urls.length > 1)
      throw new QuotaError(
        "Quota exceeded. Your plan allows a maximum of 2 entries."
      );

    const newUrlEntry = new UrlModel({
      _id: new mongoose.Types.ObjectId(),
      // domain: config.BACKEND_ORIGIN,
      url: newUrl.url,
      alias: newUrl.alias,
      //updated: Date.now(),
      userId: user._id,
    });
    const urlEntry = await newUrlEntry.save();

    user.urls.push(urlEntry._id);
    await user.save();

    return getDto(urlEntry);
  }

  async updateAlias(id: string, alias: string, userId: string): Promise<void> {
    const { entry } = await validateExistanceAndOwnership(id, userId);
    entry.alias = alias;
    entry.updated = new Date();
    await entry.save();
  }

  async deleteEntry(id: string, userId: string): Promise<boolean> {
    const { entry, user } = await validateExistanceAndOwnership(id, userId);

    //user.urls populated
    user.urls = user.urls.filter((url) => url._id.toString() !== id);
    await user.save();
    const result = await UrlModel.deleteOne({ _id: entry._id });
    if (result.deletedCount == 1) {
      return true;
    }
    return false;
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

const getById = async (id: string): Promise<UrlDocument | null> => {
  return UrlModel.findById(id);
};

const getDto = (urlEntry: UrlDocument) => {
  const { _id, alias, url, updated, userId } = urlEntry; //, domain
  return {
    id: _id.toString(),
    userId: userId.toString(),
    url,
    // domain,
    alias,
    updated,
  };
};

const validateExistanceAndOwnership = async (urlId: string, userId: string) => {
  const entry = await getById(urlId);
  if (!entry)
    throw new NotFoundError("The entry with the specified ID doesn't exist.");
  if (entry.userId._id.toString() !== userId)
    throw new ForbiddenError("The entry is owned by another user.");

  const user = await getUserByIdUnpopulated(userId);
  if (!user) throw new NotFoundError("User with the specified ID not found.");

  // user.urls populated
  const userUrl = user.urls.find((url) => url._id.toString() === urlId);
  // shouldn't occur if the create was atomic
  if (!userUrl)
    throw new NotFoundError("The entry with the specified ID doesn't exist.");

  return { entry, user };
};
