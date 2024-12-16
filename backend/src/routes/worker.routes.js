import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import {
  loginWorker,
  registerWorker,
  getWorkerProfile,
  uploadGallery,
  logoutWorker,
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
router.route("/me").get(verifyJWT, getWorkerProfile);
router.route("/logout").get(verifyJWT, logoutWorker);
router.route("/gallery").put(
  verifyJWT,
  upload.fields([
    {
      name: "gallery",
      maxCount: 5,
    },
  ]),
  uploadGallery,
);

export default router;
