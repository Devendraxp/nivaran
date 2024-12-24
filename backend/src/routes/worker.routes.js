import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  loginWorker,
  registerWorker,
  getCurrentWorker,
  uploadGallery,
  logoutWorker,
  refreshAccessToken,
  updateWorkerProfileImg,
  getWorkerProfile,
  changePassword,
  updateWorker
} from "../controllers/worker.controller.js";

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
router.route("/current-worker").get(verifyJWT, getCurrentWorker);
router.route("/logout").get(verifyJWT, logoutWorker);
router.route("/change-password").post(verifyJWT, changePassword);
router.route("/update/:id").patch(verifyJWT,updateWorker),
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
router.route("/access-token").get(refreshAccessToken);
router
  .route("/profileImg")
  .patch(verifyJWT, upload.single("avatar"), updateWorkerProfileImg);


router.route("/profile/:username").get(verifyJWT, getWorkerProfile);


export default router;
