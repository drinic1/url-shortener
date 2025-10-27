import mongoose, { Document, MergeType, Types } from "mongoose";

export interface IUrl {
  _id: Types.ObjectId;
  url: string;
  // domain: string;
  alias: string;
  updated: Date;
  userId: Types.ObjectId;
}

export type UrlDocument = Document<unknown, unknown, IUrl, unknown, unknown> &
  IUrl & {
    _id: mongoose.Types.ObjectId;
  } & {
    __v: number;
  };

export type UserDocument = Document<unknown, unknown, IUser, unknown, unknown> &
  IUser & {
    _id: Types.ObjectId;
  } & {
    __v: number;
  };

export type PopulatedUserDocument = Document<
  unknown,
  unknown,
  MergeType<
    IUser,
    {
      urls: UrlDocument[];
    }
  >,
  unknown,
  unknown
> &
  Omit<IUser, "urls"> & {
    urls: UrlDocument[];
  } & {
    _id: Types.ObjectId;
  } & {
    __v: number;
  };

export interface IUser {
  username: string;
  email: string;
  passwordHash: string;
  urls: mongoose.Types.ObjectId[];
}
