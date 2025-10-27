import express from "express";
import { userService } from "../services/serviceLoader.js";
import sessionValidator from "../middlewares/sessionValidator.js";

const router = express.Router();

router.get("/me", sessionValidator, async (req, res) => {
  const userId = req.session!.id as string;
  const user = await userService.getById(userId);

  res.status(200).json(user);
});

export default router;
