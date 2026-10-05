import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

/**
 * Authenticate requests via token header or cookie.
 * Injects req.userId and req.user (without password).
 */
const userAuth = async (req, res, next) => {
  try {
    // Accept token from header (for backward compat) or cookie
    const token = req.headers.token || req.cookies?.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. Please sign in.",
        code: "AUTH_REQUIRED",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid session. Please sign in again.",
        code: "INVALID_TOKEN",
      });
    }

    // Check user exists and is active
    const user = await User.findById(decoded.id).select("-password -verifyOtp -resetOtp -verifyOtpExpireAt -resetOtpExpireAt");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Account not found.",
        code: "USER_NOT_FOUND",
      });
    }
    if (user.status === "suspended") {
      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Contact support.",
        code: "ACCOUNT_SUSPENDED",
      });
    }

    req.userId = decoded.id;
    req.user = user;
    // Backward compat: some old controllers use req.body.userId or req.authUserId
    req.body = req.body || {};
    req.body.userId = decoded.id;
    req.authUserId = decoded.id;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please sign in again.",
        code: "TOKEN_EXPIRED",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authentication.",
      code: "AUTH_FAILED",
    });
  }
};

export default userAuth;
