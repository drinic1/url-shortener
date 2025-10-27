import config from "../utils/config.js";
import { IUserStorage } from "./interfaces/IUserStorage.js";
import { IUrlStorage } from "./interfaces/IUrlStorage.js";
import mongoose from "mongoose";

let userService: IUserStorage;
let urlService: IUrlStorage;

const loadStorages = async (type: "mongoose" | "inMemory") => {
  let user, url;
  if (type === "mongoose") {
    user = await import(`./implementations/mongoose/userService.js`);
    url = await import(`./implementations/mongoose/urlService.js`);
  } else {
    user = await import(`./implementations/inMemory/userService.js`);
    url = await import(`./implementations/inMemory/urlService.js`);
  }
  userService = new user.default();
  urlService = new url.default();
};

export const tryMongooseConnect = async () => {
  if (!config.MONGO_DB_CONNECTION_STRING) {
    await loadStorages("inMemory");
  } else {
    try {
      await mongoose.connect(config.MONGO_DB_CONNECTION_STRING, {
        serverSelectionTimeoutMS: 5000,
      });
      mongoose.connection.on("error", (error) => console.log(error));
      mongoose.connection.on("disconnected", () => console.log("disconnected"));
      await loadStorages("mongoose");
    } catch (error: unknown) {
      console.log(error);
      await loadStorages("inMemory");
    }
  }
};

export { userService, urlService };
