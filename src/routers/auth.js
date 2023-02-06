import express from "express";
import { createUser, checkUserExists, verifyUser } from "../queries/user.js";
import {
  createToken,
  deleteTokensByUserId,
  deleteToken,
} from "../queries/token.js";
import cors from "../middlewares/cors.js";
import authenticate from "../middlewares/authenticate.js";

const authRouter = express.Router();

// We use authRouter.all() instead of authRouter.get() because the
// cors middleware will only accept methods specfied in <allowedMethods>.
// We also do that, to be able to display a custom message for unallowed methods
// all() accepts all http methods
authRouter.all("/", cors({ allowedMethods: ["GET"] }), async (req, res) => {
  res.send("Welcome. Please authenticate to continue");
});

authRouter.all(
  "/register",
  cors({ allowedMethods: ["POST"] }),
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are mandatory" });
    }

    const userExists = await checkUserExists({ email });
    if (userExists) {
      return res.status(409).json({ error: "Email already exists" });
    }

    // save the details to create new user
    const user = await createUser(req.body);

    // Get the token for the user
    const { raw: token, expired_at: expiredAt } = await createToken(user.id);

    return res.status(201).json({ token, expiredAt, id: user.id });
  }
);

authRouter.all(
  "/login",
  cors({ allowedMethods: ["POST"] }),
  async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are mandatory" });
    }

    const user = await verifyUser(email, password);
    if (!user) {
      return res.status(401).json({ error: "Email or password incorrect" });
    }

    // TODO: Update last login of the user

    // Get the token for the user
    const { raw: token, expired_at: expiredAt } = await createToken(user.id);

    return res.status(201).json({ token, expiredAt });
  }
);

authRouter.all(
  "/logout",
  authenticate,
  cors({ allowedMethods: ["DELETE"] }),
  async (req, res) => {
    const { device } = req.query;

    if (device === "all") {
      await deleteTokensByUserId(req.userId);
    } else {
      await deleteToken(req.token);
    }
    return res.sendStatus(204);
  }
);

export default authRouter;
