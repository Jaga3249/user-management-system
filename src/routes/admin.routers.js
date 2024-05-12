import { Router } from "express";
import {
  AdminLogin,
  AdminLogout,
  AdminRgistation,
  addUser,
  deleteUser,
  getAllUsers,
  resetPassword,
  updateUser,
} from "../controllers/admin.controllers.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
export const AdminRouter = Router();
//routes
AdminRouter.route("/register").post(upload.single("image"), AdminRgistation);
AdminRouter.route("/login").post(AdminLogin);
AdminRouter.route("/logout").post(verifyJwt, AdminLogout);
AdminRouter.route("/reset-password").post(verifyJwt, resetPassword);
AdminRouter.route("/reset-password").post(verifyJwt, resetPassword);
AdminRouter.route("/users").post(getAllUsers);
AdminRouter.route("/add-user").post(verifyJwt, upload.single("image"), addUser);
AdminRouter.route("/update-user").post(verifyJwt, updateUser);

AdminRouter.route("/delete-user").post(verifyJwt, deleteUser);
