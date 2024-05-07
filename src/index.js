import { DbConnect } from "./db/index.js";
import express from "express";
const app = express();
DbConnect()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed !!", error);
  });
