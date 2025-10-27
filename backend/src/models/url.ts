import mongoose from "mongoose";
import { IUrl } from "../types/mongoose";

const urlSchema = new mongoose.Schema<IUrl>({
  url: { type: String, required: true },
  // domain: { type: String, required: true },
  alias: { type: String, required: true },
  updated: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

urlSchema.set("toJSON", {
  transform: (_document, ret) => {
    return {
      id: ret._id.toString(),
      url: ret.url,
      // domain: ret.domain,
      alias: ret.alias,
      updated: ret.updated,
      userId: ret.userId.toString(),
    };
  },
});

const UrlModel = mongoose.model<IUrl>("Url", urlSchema);

export default UrlModel;
