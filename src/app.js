import express from "express";
import { router } from "./routes/user.routers.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AdminRouter } from "./routes/admin.routers.js";

export const app = express();

app.use(
  cors({
    origin: process.env.CROSS_ORIGIN,
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
app.use(cookieParser());

//route import
app.use("/api/v1/users", router);
app.use("/api/v1/admin", AdminRouter);
