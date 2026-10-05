/**
 * Centralized error handling middleware.
 * Catches all errors thrown or passed via next(err).
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: messages.join(". "),
      code: "VALIDATION_ERROR",
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return res.status(409).json({
      success: false,
      message: `A record with that ${field} already exists.`,
      code: "DUPLICATE_KEY",
    });
  }

  // Mongoose cast error (invalid ObjectId, etc.)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format.",
      code: "INVALID_ID",
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication.",
      code: "AUTH_ERROR",
    });
  }

  // Multer file errors
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(413).json({
      success: false,
      message: "File is too large. Maximum size is 5MB.",
      code: "FILE_TOO_LARGE",
    });
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    return res.status(400).json({
      success: false,
      message: "Too many files or unexpected field.",
      code: "FILE_LIMIT",
    });
  }

  // Default server error
  const status = err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: status === 500 ? "Something went wrong. Please try again." : err.message,
    code: err.code || "SERVER_ERROR",
  });
};

export default errorHandler;
