import mongoose from "mongoose";
import { IUser } from "../types/mongoose";

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: { type: String, required: true },
  urls: [{ type: mongoose.Schema.Types.ObjectId, ref: "Url" }],
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    return {
      id: ret._id.toString(),
      username: ret.username,
      email: ret.email,
      passwordHash: ret.passwordHash,
      urls: ret.urls,
    };
  },
});

const UserModel = mongoose.model<IUser>("User", userSchema);

export default UserModel;
