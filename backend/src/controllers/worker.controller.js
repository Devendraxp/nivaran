import { asyncHandler } from "../utils/asyncHandler.js";
import { Worker } from "../models/worker.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const worker = await Worker.findById(userId);
    const accessToken = worker.generateAccessToken();
    const refreshToken = worker.generateRefreshToken();
    worker.refreshToken = refreshToken;
    await worker.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ApiError(500, error || "Something went wrong !");
  }
};

const registerWorker = asyncHandler(async (req, res) => {
  const { name, username, email, password } = req.body;

  if ([name, username, email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
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
    profileImg: profileImg,
    password,
    username: username.toLowerCase(),
  });

  const createdWorker = await Worker.findById(worker._id).select(
    "-password -refreshToken"
  );

  if (!createdWorker) {
    throw new ApiError(
      500,
      "Something went wrong while registering the worker"
    );
  }

  res
    .status(201)
    .json(
      new ApiResponse(200, createdWorker, "Worker registered successfully !!")
    );
});

export { registerWorker };
