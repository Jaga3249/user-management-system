import express from "express";
import { router } from "./routes/user.routers.js";
import path from "path";

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
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("view engine", "ejs");
// app.set("views", "./views");
app.set("views", path.join(__dirname, "views"));

app.use(cookieParser());
app.get("/test", (req, res) => {
  res.send("gellow world");
});
//route import
app.use("/api/v1/users", router);
app.use("/api/v1/admin", AdminRouter);
