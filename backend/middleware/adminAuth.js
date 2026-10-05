import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { ADMIN_ROLES } from "../constants/index.js";

/**
 * Admin authentication middleware.
 * Uses proper JWT with user ID (not email+password hack).
 * Checks the user has an admin role.
 */
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.token || req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Admin authentication required.",
        code: "ADMIN_AUTH_REQUIRED",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid admin session.",
        code: "INVALID_ADMIN_TOKEN",
      });
    }

    // Support legacy admin token format (email+password string) during migration
    if (typeof decoded === "string") {
      // Legacy format: token is just the email+password concatenation
      if (decoded === process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
        req.adminId = "legacy";
        req.adminRole = "super_admin";
        return next();
      }
      return res.status(401).json({
        success: false,
        message: "Invalid admin credentials.",
        code: "INVALID_ADMIN_TOKEN",
      });
    }

    // New format: proper JWT with user ID
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin session.",
        code: "INVALID_ADMIN_TOKEN",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user || !ADMIN_ROLES.includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Admin access denied.",
        code: "ADMIN_ACCESS_DENIED",
      });
    }

    req.adminId = user._id;
    req.adminRole = user.role;
    req.userId = user._id;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication failed.",
      code: "ADMIN_AUTH_FAILED",
    });
  }
};

export default adminAuth;
