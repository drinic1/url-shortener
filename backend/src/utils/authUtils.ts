import z from "zod";
import { UserLogin, UserRegistration } from "../types/incoming.js";

export const UserRegistrationSchema = z.strictObject({
  username: z.string().min(5).max(25),
  email: z.email().min(1).max(128),
  password: z.string().min(8).max(25),
});

export const UserLoginSchema = z.strictObject({
  email: z.email().min(1).max(128),
  password: z.string().min(8).max(25),
});

const validateUserRegistration = (obj: unknown): UserRegistration => {
  return UserRegistrationSchema.parse(obj);
};

const validateUserLogin = (obj: unknown): UserLogin => {
  return UserLoginSchema.parse(obj);
};

export default { validateUserRegistration, validateUserLogin };
