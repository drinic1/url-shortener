import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

import z, { ZodError } from "zod";

// dotenv.config();
dotenvExpand.expand(dotenv.config());

const schema = z.object({
  FRONTEND_ORIGIN: z.string(),
  // BACKEND_ORIGIN: z.string(),
  PORT: z.coerce.number().default(3000),
  MONGO_DB_CONNECTION_STRING: z.string().optional(),
});

// const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN ?? "http://localhost:5173";
// const BACKEND_ORIGIN = process.env.BACKEND_ORIGIN ?? "http://localhost:3000";
// const PORT = process.env.PORT ?? 3000;
// const MONGO_DB_CONNECTION_STRING = process.env.MONGO_DB_CONNECTION_STRING;

let config: z.infer<typeof schema>;

try {
  config = schema.parse(process.env);
} catch (error: unknown) {
  if (error instanceof ZodError) {
    console.error(
      "Environment variables parsing error: ",
      error.issues.map((issue) => `${issue.path}: ${issue.message}`)
    );
  } else {
    console.error(error);
  }
  process.exit(1);
}

export default config;

// export default {
//   FRONTEND_ORIGIN,
//   BACKEND_ORIGIN,
//   PORT,
//   MONGO_DB_CONNECTION_STRING,
// };
