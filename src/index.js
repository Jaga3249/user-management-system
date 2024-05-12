import { app } from "./app.js";
import dotenv from "dotenv";
import { DbConnect } from "./db/index.js";

dotenv.config({
  path: "./.env",
});

DbConnect()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`server is running at port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed !!", error);
  });
