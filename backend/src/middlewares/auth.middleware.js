import { Worker } from "../models/worker.model.js";
import { Customer } from "../models/customer.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";


export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request!");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const worker = await Worker.findById(decodedToken._id).select(
    "-password -refreshToken",
  );

  if (!worker) {
    throw new ApiError(401, "User not found!");
  }

  req.worker = worker;
  next();
});


export const verifyJWTC = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw new ApiError(401, "Unauthorized request!");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  const customer = await Customer.findById(decodedToken._id).select(
    "-password -refreshToken"
  );

  if (!customer) {
    throw new ApiError(401, "User not found!");
  }

  req.customer = customer; 
  next();
});



