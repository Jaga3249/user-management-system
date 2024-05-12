import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
export const DbConnect = async () => {
  try {
    const DbInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );

    console.log(
      `\n MongoDB connected !! DB HOST : ${DbInstance.connection.host}`
    );
  } catch (error) {
    console.log("Mongodb connection error !!", error);

    process.exit(1);
  }
};
