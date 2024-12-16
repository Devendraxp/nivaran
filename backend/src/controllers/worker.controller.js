import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Worker } from "../models/worker.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const worker = await Worker.findById(userId);
    const accessToken = worker.generateAccessToken();
    const refreshToken = worker.generateRefreshToken();
    worker.refreshToken = refreshToken;
    await worker.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong !");
  }
};

const registerWorker = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    phoneNo,
    address,
    description,
    workingHours,
    language,
    services,
    experience,
  } = req.body;

  if ([name, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All * fields are required");
  }

  const existedWorker = await Worker.findOne({
    $or: [{ email }, { username }],
  });

  if (existedWorker) {
    throw new ApiError(409, "User with this email or username already exist");
  }

  const profileImgLocalPath = req.files?.profileImg[0]?.path;

  if (!profileImgLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  const profileImg = await uploadOnCloudinary(profileImgLocalPath);
  if (!profileImg) {
    throw new ApiError(400, "profile Image is required");
  }

  const worker = await Worker.create({
    name,
    email,
    profileImg: profileImg.url,
    password,
    username: username.toLowerCase(),
    phoneNo,
    address,
    description,
    workingHours,
    language,
    services,
    experience,
  });

  const createdWorker = await Worker.findById(worker._id).select(
    "-password -refreshToken",
  );

  if (!createdWorker) {
    throw new ApiError(
      500,
      "Something went wrong while registering the worker",
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, createdWorker, "Worker registered successfully !!"),
    );
});

const loginWorker = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new ApiError(400, "Username or email and password are required");
  }

  const worker = await Worker.findOne({
    $or: [{ email: username }, { username }],
  });

  if (!worker) {
    throw new ApiError(404, "User not found");
  }

  const isLogin = worker.isPasswordCorrect(password);
  if (!isLogin) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    worker._id,
  );

  const workerData = await Worker.findById(worker._id).select(
    "-password -refreshToken",
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, { worker: workerData }, "Worker login successfully"),
    );
});

export { registerWorker, loginWorker };
