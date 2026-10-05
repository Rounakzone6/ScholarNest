import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";
import { notifyByEmail } from "../services/notificationService.js";
import { getEmailHtml } from "../services/emailService.js";
import { VERIFICATION_STATUS, USER_ROLES, ADMIN_ROLES } from "../constants/index.js";

// ── Helpers ───────────────────────────────────────────────────────────
const createToken = (id, expiresIn = "7d") =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn });

const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const generateOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    /[a-z]/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^a-zA-Z\d]/.test(password)
  );
};

// ── Register ──────────────────────────────────────────────────────────
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name?.trim() || !email?.trim() || !phone?.trim() || !password) {
      return res.status(400).json({ success: false, message: "All fields are required.", code: "MISSING_FIELDS" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Please provide a valid email address.", code: "INVALID_EMAIL" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
        code: "WEAK_PASSWORD",
      });
    }

    const existing = await User.findOne({ $or: [{ email: email.toLowerCase() }, { phone }] });
    if (existing) {
      return res.status(409).json({ success: false, message: "An account with that email or phone already exists.", code: "DUPLICATE_ACCOUNT" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password: hashedPassword,
    });

    // Generate username from name + partial ID
    user.username = `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${String(user._id).slice(-5)}`;
    await user.save();

    const token = createToken(user._id);
    setTokenCookie(res, token);

    // Send welcome email
    const welcomeHtml = getEmailHtml("welcome", { name: user.name, email: user.email });
    notifyByEmail({
      to: user.email,
      subject: "Welcome to ScholarNest",
      html: welcomeHtml,
      text: `Welcome to ScholarNest, ${user.name}! Your account has been created.`,
    });

    res.status(201).json({
      success: true,
      token,
      message: "Account created successfully.",
    });
  } catch (error) {
    next(error);
  }
};

// ── Login ─────────────────────────────────────────────────────────────
export const loginUser = async (req, res, next) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone?.trim() || !password) {
      return res.status(400).json({ success: false, message: "Enter your email or phone and password.", code: "MISSING_FIELDS" });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone.toLowerCase().trim() },
        { phone: emailOrPhone.trim() },
      ],
    }).select("+password");

    if (!user) {
      return res.status(401).json({ success: false, message: "No account found with those credentials.", code: "USER_NOT_FOUND" });
    }

    if (user.status === "suspended") {
      return res.status(403).json({ success: false, message: "This account has been suspended.", code: "ACCOUNT_SUSPENDED" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Incorrect password.", code: "WRONG_PASSWORD" });
    }

    // Update last active
    user.lastActiveAt = new Date();
    await user.save();

    const token = createToken(user._id);
    setTokenCookie(res, token);

    res.json({ success: true, token });
  } catch (error) {
    next(error);
  }
};

// ── Logout ────────────────────────────────────────────────────────────
export const logout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  });
  res.json({ success: true, message: "Signed out." });
};

// ── Get current user profile ──────────────────────────────────────────
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).populate("campus", "university campusName city");
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// ── Update profile ────────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const allowedFields = ["name", "bio", "college", "campus", "campusName", "course", "academicYear", "avatar"];
    const updates = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const user = await User.findByIdAndUpdate(req.userId, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });
    res.json({ success: true, data: user, message: "Profile updated." });
  } catch (error) {
    next(error);
  }
};

// ── Public profile ────────────────────────────────────────────────────
export const getPublicProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ success: false, message: "Student not found." });
    res.json({ success: true, data: user.toPublicProfile() });
  } catch (error) {
    next(error);
  }
};

// ── Send verification OTP ─────────────────────────────────────────────
export const sendVerifyOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select("+verifyOtp +verifyOtpExpireAt");
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });
    if (user.isEmailVerified) {
      return res.json({ success: false, message: "Email already verified." });
    }

    const otp = generateOtp();
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const html = getEmailHtml("email_verify", { otp, email: user.email });
    await notifyByEmail({
      to: user.email,
      subject: "ScholarNest – Verify your email",
      html,
      text: `Your verification code is ${otp}. Valid for 24 hours.`,
    });

    res.json({ success: true, message: "Verification code sent to your email." });
  } catch (error) {
    next(error);
  }
};

// ── Verify email ──────────────────────────────────────────────────────
export const verifyEmail = async (req, res, next) => {
  try {
    const { otp } = req.body;
    if (!otp) return res.status(400).json({ success: false, message: "Enter the verification code." });

    const user = await User.findById(req.userId).select("+verifyOtp +verifyOtpExpireAt");
    if (!user) return res.status(404).json({ success: false, message: "Account not found." });

    if (user.verifyOtp !== otp || !user.verifyOtp) {
      return res.status(400).json({ success: false, message: "Invalid verification code." });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Code expired. Request a new one." });
    }

    user.isEmailVerified = true;
    user.verificationStatus = VERIFICATION_STATUS.VERIFIED;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Email verified successfully." });
  } catch (error) {
    next(error);
  }
};

// ── Send password reset OTP ───────────────────────────────────────────
export const sendResetOtp = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email?.trim()) return res.status(400).json({ success: false, message: "Enter your email address." });

    const user = await User.findOne({ email: email.toLowerCase() }).select("+resetOtp +resetOtpExpireAt");
    if (!user) return res.status(404).json({ success: false, message: "No account found with that email." });

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const html = getEmailHtml("password_reset", { otp, email: user.email });
    await notifyByEmail({
      to: user.email,
      subject: "ScholarNest – Reset your password",
      html,
      text: `Your password reset code is ${otp}. Valid for 15 minutes.`,
    });

    res.json({ success: true, message: "Reset code sent to your email." });
  } catch (error) {
    next(error);
  }
};

// ── Reset password ────────────────────────────────────────────────────
export const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email?.trim() || !otp?.trim() || !newPassword?.trim()) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters with uppercase, lowercase, number, and special character.",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+resetOtp +resetOtpExpireAt +password");
    if (!user) return res.status(404).json({ success: false, message: "No account found." });

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid reset code." });
    }
    if (user.resetOtpExpireAt < Date.now()) {
      return res.status(400).json({ success: false, message: "Code expired. Request a new one." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();

    res.json({ success: true, message: "Password updated. You can now sign in." });
  } catch (error) {
    next(error);
  }
};

// ── Check auth status ─────────────────────────────────────────────────
export const isAuthenticated = async (req, res) => {
  res.json({ success: true });
};

// ── Admin login (supports legacy + new) ───────────────────────────────
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    // Check if this is a database-backed admin user
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (user && ADMIN_ROLES.includes(user.role)) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = createToken(user._id, "12h");
        return res.json({ success: true, token });
      }
    }

    // Legacy fallback: environment-based admin
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    }

    res.status(401).json({ success: false, message: "Invalid admin credentials." });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Get Verification Queue ──────────────────────────────────────
export const getVerificationQueue = async (req, res, next) => {
  try {
    const users = await User.find({ verificationStatus: { $in: ["pending", "verified", "rejected"] } })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// ── Admin: Moderate User ───────────────────────────────────────────────
export const moderateUser = async (req, res, next) => {
  try {
    const { userId, status, reason } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    user.verificationStatus = status;
    if (status === "verified") {
      user.isAccountVerified = true;
    }
    await user.save();
    res.json({ success: true, message: `User status updated to ${status}.` });
  } catch (error) {
    next(error);
  }
};
