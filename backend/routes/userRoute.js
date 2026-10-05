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
  getMe,
  getPublicProfile,
  updateProfile,
  verifyEmail,
  getVerificationQueue,
  moderateUser,
} from "../controllers/userController.js";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import { authRateLimit, otpRateLimit } from "../middleware/rateLimit.js";

const userRouter = express.Router();

userRouter.post("/register", authRateLimit, registerUser);
userRouter.post("/login", authRateLimit, loginUser);
userRouter.post("/logout", logout);
userRouter.get("/get-profile", userAuth, getMe);
userRouter.put("/profile", userAuth, updateProfile);
userRouter.get("/profile/:username", getPublicProfile);
userRouter.post("/admin", authRateLimit, adminLogin);

// OTP
userRouter.post("/send-verify-otp", userAuth, otpRateLimit, sendVerifyOtp);
userRouter.post("/verify-account", userAuth, verifyEmail);
userRouter.post("/is-auth", userAuth, isAuthenticated);
userRouter.post("/send-reset-otp", otpRateLimit, sendResetOtp);
userRouter.post("/reset-password", authRateLimit, resetPassword);

// Admin Routes
userRouter.get("/admin/verification-queue", adminAuth, getVerificationQueue);
userRouter.post("/admin/moderate-user", adminAuth, moderateUser);

export default userRouter;
