import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { verifyJWTC } from "../middlewares/auth.middleware.js";

import { 
  registerCustomer ,
  loginCustomer,
  logoutCustomer,
  getCustomerProfile,
  updateProfile,
  updatePassword,
  UpdateprofilePic
} from "../controllers/customer.controller.js";

const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "profileImg",
      maxCount: 1,
    },
  ]),
  registerCustomer
);

router.route("/login").post(loginCustomer);

router.route("/logout").get(verifyJWTC, logoutCustomer);

router.route("/me").get(verifyJWTC, getCustomerProfile );

router.route("/update/:id").patch(verifyJWTC,updateProfile);

router.route("/update/:id/password").patch(verifyJWTC,updatePassword);

router.route("/update/:id/profilePic").put(
  verifyJWTC,
  upload.fields([{ name: "profileImg", maxCount: 1 }]), 
    UpdateprofilePic,
  );


export default router;
