import z from "zod";
import { AliasUpdateSchema, NewUrlSchema } from "../utils/urlUtils.js";
import { UserLoginSchema, UserRegistrationSchema } from "../utils/authUtils.js";

export type UserRegistration = z.infer<typeof UserRegistrationSchema>;

export type UserLogin = z.infer<typeof UserLoginSchema>;

export type NewUrl = z.infer<typeof NewUrlSchema>;

export type AliasUpdate = z.infer<typeof AliasUpdateSchema>;
