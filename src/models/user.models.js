import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "mobile number is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    image: {
      type: String,
      required: [true, "Image is required"],
    },
    is_admin: {
      type: Number,
      required: true,
    },
    is_verified: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
