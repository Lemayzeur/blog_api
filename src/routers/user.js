import express from "express";
import { getUserById } from "../queries/user.js";
import authenticate from "../middlewares/authenticate.js";
import cors from "../middlewares/cors.js";

const userRouter = express.Router();

userRouter.get("/me", authenticate, async (req, res) => {
  const user = await getUserById(req.userId);
  return res.json(user);
});

export default userRouter;
