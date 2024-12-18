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

//register route
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

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    worker._id,
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(201)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(200, createdWorker, "Worker registered successfully !!"),
    );
});
//login route
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
//logout route
const logoutWorker = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(400, "Unauthorized access");
  }
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("refreshToken", "", options)
    .cookie("accessToken", "", options)
    .json(new ApiResponse(200, "", "Logout successfully !!"));
});

//profile route

const getCurrentWorker = asyncHandler(async (req, res) => {
  const worker = await Worker.findById(req.worker._id).select(
    "-password -refreshToken",
  );

  if (!worker) {
    throw new ApiError(404, "Worker not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, worker, "Worker profile fetched successfully"));
});

// upload gallery route
//  under construction !!!
const uploadGallery = asyncHandler(async (req, res) => {
  const { worker } = req;
  const { gallery } = req.files;

  if (!gallery) {
    throw new ApiError(400, "Gallery is required");
  }
  const galleryImages = await Promise.all(
    gallery.map(async (file) => {
      const img = await uploadOnCloudinary(file.path);
      return img;
    }),
  );

  galleryImages.map((img) => {
    worker.gallery.push(img.url);
  });
  await worker.save({ validateBeforeSave: false });
  console.log("worker :", worker);

  res
    .status(200)
    .json(
      new ApiResponse(200, worker, "Gallery images uploaded successfully !!"),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new ApiError(400, "Unauthorized access");
  }

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, worker) => {
    if (err) {
      throw new ApiError(403, "Invalid refresh token");
    }

    const { accessToken } = await generateAccessAndRefreshToken(worker._id);

    return res.status(200).cookie("accessToken", accessToken).json(new ApiResponse(200,"", "Token refreshed successfully"));
  });
})

const updateWorkerProfileImg = asyncHandler(async (req, res) => {
  
  const worker = Worker.findById(req.worker._id).select("-password -refreshToken");

  const profileImgLocalPath = req.files?.profileImg[0]?.path;

  if (!profileImgLocalPath) {
    throw new ApiError(400, "Profile picture is required");
  }

  const profileImg = await uploadOnCloudinary(profileImgLocalPath);
  if (!profileImg) {
    throw new ApiError(400, "profile Image is required");
  }

  worker.profileImg = profileImg;
  await worker.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(
      new ApiResponse(200, worker, "Profile image updated successfully !!"),
    );
});

const getWorkerProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const worker = await Worker.find({
    $or: [{ name: username }, { username }],
  }).select("-password -refreshToken");

});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const worker = await Worker.findById(req.worker._id);

  if (!worker) {
    throw new ApiError(404, "Worker not found");
  }

  const isCorrect = await worker.isPasswordCorrect(oldPassword);

  if (!isCorrect) {
    throw new ApiError(401, "Invalid old password");
  }

  worker.password = newPassword;
  await worker.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, "", "Password changed successfully !!"),
    );
});

//exporting the functions
export {
  registerWorker,
  loginWorker,
  logoutWorker,
  getCurrentWorker,
  uploadGallery,
  refreshAccessToken,
  updateWorkerProfileImg,
  getWorkerProfile,
  changePassword,
};
