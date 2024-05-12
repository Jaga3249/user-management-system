import { asyncHandle } from "../utils/AsyncHandler.js";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import bcrypt from "bcrypt";
import { ApiResponse } from "../utils/ApiResponse.js";
import sendVerificationEmail from "../utils/sendVerificationEmail.js";

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

// user register
export const userRegistaration = asyncHandle(async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const existUser = await User.findOne({
    $or: [{ mobile }, { email }],
  });

  if (existUser) {
    throw new ApiError(400, "user is already exist with given email or mobile");
  }
  let hashedpassword = await bcrypt.hash(password, 10);

  let userImage = req.file && req.file.filename;

  if (!userImage) {
    throw new ApiError(400, "user image is required");
  }

  const user = await User.create({
    name,
    email,
    mobile,
    password: hashedpassword,
    image: userImage,
    is_admin: 0,
  });
  console.log("user", user);
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(404, "something went Wrong while registering user");
  }
  await sendVerificationEmail(
    createdUser.name,
    createdUser.email,
    createdUser._id
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        createdUser,
        "user registred sucessfully, Please verify youe mail"
      )
    );
});
// export const verifyEmailByUser = asyncHandle(async (req, res) => {
//   console.log("query: ", req.query);
// });
export const EmailVerify = asyncHandle(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user is not found for given email");
  }
  if (user.is_verified === 1) {
    throw new ApiError(400, "email is already verified");
  }
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { $set: { is_verified: 1 } },
    { new: true }
  ).select("-password -refreshToken");
  return res
    .status(200)
    .json(new ApiResponse(201, updatedUser, "email verified sucessfully"));
});
export const userLogin = asyncHandle(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "All fields are required");
  }
  const registerdUser = await User.findOne({ email });

  if (!registerdUser) {
    throw new ApiError(404, "user doesn't exist");
  }
  if (registerdUser.is_verified === 0) {
    throw new ApiError(400, "please verify your email");
  }
  const isvalidPassword = await bcrypt.compare(
    password,
    registerdUser.password
  );

  if (!isvalidPassword) {
    throw new ApiError(400, "Invalid password");
  }
  const { acessToken, refreshToken } = await generateAcessAndRefreshToken(
    registerdUser._id
  );
  const option = {
    httpOnly: true,
    secure: true,
  };
  const loggedInUser = await User.findById(registerdUser._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .cookie("acessToken", acessToken, option)
    .cookie("refreshToken", refreshToken, option)
    .json(
      new ApiResponse(201, {
        user: loggedInUser,
        refreshToken,
        acessToken,
      })
    );
});

export const userLogout = asyncHandle(async (req, res) => {
  await User.findByIdAndUpdate(req.user?._id, {
    $unset: { refreshToken: 1 },
  });
  const option = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("acessToken", option)
    .clearCookie("refreshToken", option)
    .json(new ApiResponse(200, {}, "User logged out successfully."));
});

export const resetPassword = asyncHandle(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const loggedInUser = await User.findById(req.user?._id);
  if (!loggedInUser) {
    throw new ApiError(404, "user is not found");
  }
  const isCorrect = await bcrypt.compare(oldPassword, loggedInUser.password);

  if (!isCorrect) {
    throw new ApiError(400, "oldPassword is invalid");
  }
  let hashedPassword = await bcrypt.hash(newPassword, 10);
  loggedInUser.password = hashedPassword;
  await loggedInUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(201, {}, "user password change sucessfully"));
});
