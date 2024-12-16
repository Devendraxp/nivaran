import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginWorker,
  registerWorker,
} from "../controllers/worker.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileImg",
      maxCount: 1,
    },
  ]),
  registerWorker,
);

router.route("/login").post(loginWorker);

// secured routes

export default router;
