import z from "zod";
import { AliasUpdate, NewUrl } from "../types/incoming.js";

export const NewUrlSchema = z.strictObject({
  url: z.httpUrl().min(1).max(512).normalize(),
  alias: z.string().max(24),
});

export const AliasUpdateSchema = z.strictObject({
  alias: z.string().min(1).max(24),
});

const validateNewUrl = (obj: unknown): NewUrl => {
  return NewUrlSchema.parse(obj);
};

const validateAliasUpdate = (obj: unknown): AliasUpdate => {
  return AliasUpdateSchema.parse(obj);
};

export default { validateNewUrl, validateAliasUpdate };
