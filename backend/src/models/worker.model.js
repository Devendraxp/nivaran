import mongoose from "mongoose";
import { Schema } from "mongoose";
import { Rating } from "./rating.model.js";
import { Customer } from "./customer.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// const imageSchema = new Schema({
//   filename: String,
//   imgUrl: {
//     type: String,
//     default:
//       "https://img.freepik.com/premium-vector/illustration-modern-construction-working-man-laptop-use-cartoon-vector-white-background_734841-247.jpg?semt=ais_hybrid",
//   },
// });

const workerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phoneNo: {
      type: Number,
    },
    address: {
      flatNo: {
        type: String,
        // required: true,
      },
      town: {
        type: String,
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      state: {
        type: String,
        // required: true,
      },
      pincode: {
        type: Number,
        // required: true,
      },
    },
    profileImg: {
      type: String,
      default:
        "https://img.freepik.com/premium-vector/illustration-modern-construction-working-man-laptop-use-cartoon-vector-white-background_734841-247.jpg?semt=ais_hybrid",
    },
    workingHours: {
      type: [Date],
      //   required: true,
    },
    description: {
      type: String,
      // required: true,
    },
    language: {
      type: [String],
      //   required: true,
    },
    services: {
      type: [String],
      //   required: true,
    },
    rating: [
      {
        type: Schema.Types.ObjectId,
        ref: "Rating",
      },
    ],
    experience: {
      type: Number,
      //   required: true,
    },
    gallery: [String],
    password: {
      type: String,
      //   required: true,
    },
    refreshToken: {
      type: String,
    },
  },
  {
    timeStamps: true,
  },
);

// workerSchema.pre("save", function (next) {
//   // Apply the default URL if imgUrl is empty
//   this.profileImg.forEach((img) => {
//     if (!img.imgUrl) {
//       img.imgUrl =
//         "https://img.freepik.com/premium-vector/illustration-modern-construction-working-man-laptop-use-cartoon-vector-white-background_734841-247.jpg?semt=ais_hybrid";
//     }
//   });
//   next();
// });
// Check, is password changed ? and Hash the password before saving
workerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  try {
    this.password = await bcrypt.hash(this.password, 8);
    next();
  } catch (error) {
    next(error);
  }
});
// Check, Is provided password correct or not
workerSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate JWT token
workerSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};
workerSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

export const Worker = mongoose.model("Worker", workerSchema);
