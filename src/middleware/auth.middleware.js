import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandle } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJwt = asyncHandle(async (req, res, next) => {
  try {
    const token =
      req.cookies?.acessToken ||
      req.header("Authorization")?.replace("Bearer", "");
    if (!token) {
      throw new ApiError(401, "unAuthorized user");
    }
    const decodeValue = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("decodeValue", decodeValue);
    const user = await User.findById(decodeValue._id);
    if (!user) {
      throw new ApiError(400, "missing acess token");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error.message || "Invalid acess token");
  }
});
