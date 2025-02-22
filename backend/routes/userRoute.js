import express from "express";
import {
  adminLogin,
  isAuthenticated,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  sendResetOtp,
  sendVerifyOtp,
  userProfile,
  verifyEmail,
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.get("/get-profile", userAuth, userProfile);
userRouter.post("/admin", adminLogin);

//OTP
userRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
userRouter.post("/verify-account", userAuth, verifyEmail);
userRouter.post("/is-auth", userAuth, isAuthenticated);
userRouter.post("/send-reset-otp", sendResetOtp);
userRouter.post("/reset-password", resetPassword);

export default userRouter;
