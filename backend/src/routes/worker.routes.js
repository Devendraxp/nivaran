import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { registerWorker } from "../controllers/worker.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileImg",
      maxCount: 1,
    },
  ]),
  registerWorker
);

export default router;
