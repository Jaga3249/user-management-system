import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandle } from "../utils/AsyncHandler.js";
import bcrypt from "bcrypt";

//admin controller

const generateAcessAndRefreshToken = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(400, "user is not found");
  }
  const acessToken = user.generateAcessToken(user);
  const refreshToken = user.generateRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { acessToken, refreshToken };
};
export const AdminRgistation = asyncHandle(async (req, res) => {
  //recive data
  //email-user
  //cerate doc
  //save

  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findOne({ email });
  if (user) {
    throw new ApiError(401, "user is already exist with given email");
  }
  const image = req.file && req.file.filename;
  if (!image) {
    throw new ApiError(400, "image is missing");
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  const registerdUser = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
    image,
    is_admin: 1,
  });
  const createUser = await User.findById(registerdUser._id).select(
    "-password -refreshToken"
  );
  if (!createUser) {
    throw new ApiError(404, "Something Went Wrong While registreing user");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        createUser,
        "user registered sucessfully!, Plaese verify your mail"
      )
    );
});
export const AdminLogin = asyncHandle(async (req, res) => {
  //email and password
  //emailid-find user
  // password check
  //check is_admin status
  //refresh and acessToken generate
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existUser = await User.findOne({ email });
  if (!existUser) {
    throw new ApiError(404, "user is not found");
  }
  if (existUser.is_verified === 0) {
    throw new ApiError(401, "Please Verify your mail");
  }
  const passwordMatch = await bcrypt.compare(password, existUser.password);
  if (!passwordMatch) {
    throw new ApiError(401, "Invalid Password");
  }
  if (existUser.is_admin === 0) {
    throw new ApiError(400, "Invalid email and password");
  }
  const { acessToken, refreshToken } = await generateAcessAndRefreshToken(
    existUser._id
  );
  const loggInUser = await User.findById(existUser._id).select(
    "-password -refreshToken"
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .cookie("refreshToken", refreshToken, option)
    .cookie("acessToken", acessToken, option)
    .json(
      new ApiResponse(
        200,
        {
          user: loggInUser,
          acessToken,
          refreshToken,
        },
        "user loggedIn sucessfully"
      )
    );
});
export const AdminLogout = asyncHandle(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $unset: { refreshToken: 1 },
  });

  const option = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("refreshToken", option)
    .clearCookie("acessToken", option)
    .json(new ApiResponse(200, {}, "user logged out sucessfully"));
});
export const resetPassword = asyncHandle(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const existUser = await User.findById(req.user?._id);
  if (!existUser) {
    throw new ApiError(404, "user is not found");
  }
  const passwordMatch = await bcrypt.compare(oldPassword, existUser.password);
  if (!passwordMatch) {
    throw new ApiError(404, "Invalid password");
  }
  let hashedPassword = await bcrypt.hash(newPassword, 10);
  existUser.password = hashedPassword;
  await existUser.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset sucessfully"));
});
export const getAllUsers = asyncHandle(async (req, res) => {
  const users = await User.find({ is_admin: 0 }).select("-password -password");
  res.status(200).json(new ApiResponse(200, users, "user fetch sucessfully"));
});

export const addUser = asyncHandle(async (req, res) => {
  // check current user is admin or not
  const admin = req.user && req.user.is_admin;
  if (admin != 1) {
    throw new ApiError(401, "Unauthorized user");
  }

  const { name, email, mobile, password } = req.body;
  if (!name || !email || !mobile || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existUser = await User.findOne({ email });
  if (existUser) {
    throw new ApiError(400, "User is already exist with given mail");
  }
  let hashedPassword = await bcrypt.hash(password, 10);
  const image = req.file && req.file.filename;
  if (!image) {
    throw new ApiError(401, "image is missing");
  }
  const addUser = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
    image,
    is_admin: 0,
  });

  const saveUser = await User.findById(addUser._id).select(
    "-password -refreshToken"
  );
  if (!saveUser) {
    throw new ApiError(401, "something went Wrong while add user");
  }

  return res
    .status(200)
    .json(new ApiResponse(201, saveUser, "user added sucessfully"));
});
export const updateUser = asyncHandle(async (req, res) => {
  const admin = req.user && req.user.is_admin;
  if (admin != 1) {
    throw new ApiError(401, "unAuthorized user");
  }
  const { name, email, mobile, image, is_verified } = req.body;
  if (!email) {
    throw new ApiError(400, "mail is required");
  }
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new ApiError(404, " user is not found");
  }
  const avatar = req.file && req.file.filename;
  if (!avatar) {
    throw new ApiError(400, "avatar is missing");
  }
  existingUser.image = avatar;

  if (name) existingUser.name = name;
  else if (mobile) {
    existingUser.mobile = mobile;
  } else if (is_verified) {
    existingUser.is_verified = is_verified;
  }
  await existingUser.save({ validateBeforeSave: false });
  return res
    .status(200)
    .json(new ApiResponse(201, existingUser, "user updated sucessfully"));
});

export const deleteUser = asyncHandle(async (req, res) => {
  const admin = req.user && req.user.is_admin;
  if (admin != 1) {
    throw new ApiError(401, "unAuthorized user");
  }
  const { _id } = req.body;
  const existUser = await User.findOne({ _id });
  if (!existUser) {
    throw new ApiError(404, "user is not exist");
  }
  await User.deleteOne({ _id: existUser._id });
  return res
    .status(200)
    .json(new ApiResponse(201, {}, "user deleted sucessfully"));
});
