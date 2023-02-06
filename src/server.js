import "dotenv/config.js";
import express from "express";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import authRouter from "./routers/auth.js";
import userRouter from "./routers/user.js";
import postRouter from "./routers/post.js";
import migrate from "./db/migration.js";

const app = express();

// To accept json request
app.use(express.json());

// To accept cookies
app.use(cookieParser());

// rate limiting
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 40, // 40 requests per minute
  })
);

app.use("", authRouter);
app.use("/users", userRouter);
app.use("/posts", postRouter);

// async migration of the database
migrate();

// Auth server listen on port
const port = process.env.SERVER_PORT || 8080;
app.listen(port, function () {
  console.log(`Server is running on ${port}`);
});
