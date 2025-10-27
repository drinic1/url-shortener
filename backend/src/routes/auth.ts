import express, { Request, Response, NextFunction } from "express";
import { userService } from "../services/serviceLoader.js";
import { UserRegistration, UserLogin } from "../types/incoming.js";
import utils from "../utils/authUtils.js";
import sessionValidator from "../middlewares/sessionValidator.js";

const router = express.Router();

const registrationParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    utils.validateUserRegistration(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

const loginParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    utils.validateUserLogin(req.body);
    next();
  } catch (error: unknown) {
    next(error);
  }
};

router.post(
  "/register",
  registrationParser,
  async (req: Request<unknown, unknown, UserRegistration>, res: Response) => {
    const newUser = await userService.addUser(req.body);
    if (req.session) req.session.id = newUser.id;
    res.status(201).json(newUser);
  }
);

router.post(
  "/login",
  loginParser,
  async (req: Request<unknown, unknown, UserLogin>, res: Response) => {
    const { email, password } = req.body;
    const matchedUser = await userService.authenticate(email, password);

    if (req.session) req.session.id = matchedUser.id;
    res.status(200).json(matchedUser);
  }
);

router.post("/logout", sessionValidator, (req, res) => {
  req.session = null;
  res.sendStatus(204);
});

export default router;
