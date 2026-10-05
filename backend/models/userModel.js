import mongoose from "mongoose";
import {
  USER_ROLES,
  ACCOUNT_STATUS,
  VERIFICATION_STATUS,
} from "../constants/index.js";

const userSchema = new mongoose.Schema(
  {
    // ── Identity ──────────────────────────────────────────────────
    name: { type: String, required: true, trim: true },
    username: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true,
    },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },

    // ── Profile ───────────────────────────────────────────────────
    avatar: { type: String, default: "" },
    bio: { type: String, default: "", maxlength: 500 },
    college: { type: String, default: "" },
    campus: { type: mongoose.Schema.Types.ObjectId, ref: "Campus", default: null },
    campusName: { type: String, default: "" }, // denormalized for display
    course: { type: String, default: "" },
    academicYear: { type: String, default: "" },

    // ── Verification ──────────────────────────────────────────────
    verificationStatus: {
      type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.UNVERIFIED,
    },
    verificationEmail: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },

    // OTP for email verification
    verifyOtp: { type: String, default: "", select: false },
    verifyOtpExpireAt: { type: Number, default: 0, select: false },

    // OTP for password reset
    resetOtp: { type: String, default: "", select: false },
    resetOtpExpireAt: { type: Number, default: 0, select: false },

    // ── Reputation ────────────────────────────────────────────────
    rating: { type: Number, default: 0, min: 0, max: 5 },
    ratingCount: { type: Number, default: 0 },
    sellerStats: {
      totalSales: { type: Number, default: 0 },
      totalListings: { type: Number, default: 0 },
      activeListing: { type: Number, default: 0 },
    },
    buyerStats: {
      totalPurchases: { type: Number, default: 0 },
    },
    responseRate: { type: Number, default: 0, min: 0, max: 100 },
    lastActiveAt: { type: Date, default: Date.now },

    // ── Role & Status ─────────────────────────────────────────────
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT,
    },
    status: {
      type: String,
      enum: Object.values(ACCOUNT_STATUS),
      default: ACCOUNT_STATUS.ACTIVE,
    },

    // ── Blocked Users ─────────────────────────────────────────────
    blockedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true, minimize: false }
);

// ── Indexes ─────────────────────────────────────────────────────────
userSchema.index({ campus: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ verificationStatus: 1 });

// ── Method: public profile ──────────────────────────────────────────
userSchema.methods.toPublicProfile = function () {
  return {
    _id: this._id,
    name: this.name,
    username: this.username,
    avatar: this.avatar,
    bio: this.bio,
    college: this.college,
    campusName: this.campusName,
    course: this.course,
    academicYear: this.academicYear,
    verificationStatus: this.verificationStatus,
    isEmailVerified: this.isEmailVerified,
    rating: this.rating,
    ratingCount: this.ratingCount,
    sellerStats: this.sellerStats,
    responseRate: this.responseRate,
    createdAt: this.createdAt,
  };
};

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
