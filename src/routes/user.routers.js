import { Router } from "express";
import {
  EmailVerify,
  resetPassword,
  userLogin,
  userLogout,
  userRegistaration,
} from "../controllers/user.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
export const router = Router();

//route
router.route("/register").post(upload.single("image"), userRegistaration);
router.route("/verify").post(EmailVerify);
router.route("/login").post(userLogin);
router.route("/logout").post(verifyJwt, userLogout);
router.route("/reset-password").post(verifyJwt, resetPassword);
router.route("/verify").get(resetPassword);
