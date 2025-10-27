import express, { NextFunction, Request, Response } from "express";
import sessionValidator from "../middlewares/sessionValidator.js";
import { AliasUpdate, NewUrl } from "../types/incoming.js";
import utils from "../utils/urlUtils.js";
import { urlService } from "../services/serviceLoader.js";

const router = express.Router();

const newUrlParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    utils.validateNewUrl(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const aliasUpdateParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    utils.validateAliasUpdate(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/",
  sessionValidator,
  newUrlParser,
  async (req: Request<unknown, unknown, NewUrl>, res: Response) => {
    const userId = req.session!.id as string;
    // eslint-disable-next-line prefer-const
    let { url, alias } = req.body;

    if (alias && (await urlService.getByAlias(alias))) {
      res.status(409).json({ error: "alias already taken." });
      return;
    }

    //TODO maybe refactor into the createEntry() method
    if (!alias) {
      alias = await urlService.getUniqueAlias();
    }
    const newEntry = await urlService.createEntry({ url, alias }, userId);
    res.status(201).json(newEntry);
  }
);

router.patch(
  "/:id",
  sessionValidator,
  aliasUpdateParser,
  async (req: Request<{ id: string }, unknown, AliasUpdate>, res) => {
    const userId = req.session!.id as string;

    const id = req.params.id;
    const { alias } = req.body;

    if (await urlService.getByAlias(alias)) {
      res.status(409).json({ error: "alias already taken." });
      return;
    }

    await urlService.updateAlias(id, alias, userId);
    res.sendStatus(204);
  }
);

router.delete(
  "/:id",
  sessionValidator,
  async (req: Request<{ id: string }>, res) => {
    const userId = req.session!.id as string;
    const id = req.params.id;
    console.log(userId);
    const success = await urlService.deleteEntry(id, userId);
    if (success) {
      res.sendStatus(204);
      return;
    } else {
      res.sendStatus(404);
      return;
    }
  }
);

export default router;
