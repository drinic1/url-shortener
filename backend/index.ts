import config from "./src/utils/config.js";
import express, { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import helmet from "helmet";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  QuotaError,
  UnauthorizedError,
} from "./src/errors.js";
import cookieSession from "cookie-session";
import cors from "cors";
import {
  urlService,
  tryMongooseConnect,
} from "./src/services/serviceLoader.js";

import urlRouter from "./src/routes/urls.js";
import userRouter from "./src/routes/users.js";
import authRouter from "./src/routes/auth.js";

const app = express();

await tryMongooseConnect();
console.log(urlService);

app.use(
  cors({
    origin: config.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(
  helmet({
    // contentSecurityPolicy: {
    //   reportOnly: true,
    // },
  })
);

app.use(express.json());

app.use(
  cookieSession({
    name: "session",
    keys: ["key1"],
    maxAge: 3600 * 1000,
    path: "/",
    httpOnly: true,
    signed: true,
    overwrite: true,
    // sameSite: "none",
    // secure: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/urls", urlRouter);
app.use("/api/users", userRouter);

app.get("/redirect/:alias", async (req, res) => {
  const alias = req.params.alias;
  const urlEntry = await urlService.getByAlias(alias);
  if (!urlEntry) {
    res.status(404).json({ error: "Page not found." });
    return;
  }

  res.json(urlEntry.url);
});

app.use((error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof ZodError) {
    return res.status(400).json({ error: error.issues });
  } else if (error instanceof BadRequestError) {
    return res.status(400).json({ error: error.message });
  } else if (error instanceof UnauthorizedError) {
    return res.status(401).json({ error: error.message });
  } else if (error instanceof NotFoundError) {
    return res.status(404).json({ error: error.message });
  } else if (error instanceof ConflictError) {
    return res.status(409).json({ error: error.message });
  } else if (error instanceof QuotaError) {
    return res.status(403).json({ error: error.message });
  }
  //security measure
  else if (error instanceof ForbiddenError) {
    return res.status(404).json({ error: "Not found." });
  } else {
    return next(error);
  }
});

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}..`);
});

export default app;
