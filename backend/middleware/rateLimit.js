/**
 * Simple in-memory rate limiter.
 * For production, use redis-backed solution.
 */
const rateLimitStore = new Map();

const CLEANUP_INTERVAL = 60 * 1000; // Clean expired entries every 60s
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now > entry.resetAt) rateLimitStore.delete(key);
  }
}, CLEANUP_INTERVAL);

/**
 * Create a rate limiter middleware.
 * @param {Object} opts
 * @param {number} opts.windowMs - Time window in ms
 * @param {number} opts.max - Max requests per window
 * @param {string} opts.message - Error message
 */
export const rateLimit = ({ windowMs = 15 * 60 * 1000, max = 100, message = "Too many requests. Please try again later." } = {}) => {
  return (req, res, next) => {
    const key = `${req.ip}:${req.originalUrl}`;
    const now = Date.now();
    let entry = rateLimitStore.get(key);

    if (!entry || now > entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      rateLimitStore.set(key, entry);
    }

    entry.count++;

    if (entry.count > max) {
      return res.status(429).json({
        success: false,
        message,
        code: "RATE_LIMIT_EXCEEDED",
      });
    }

    next();
  };
};

/**
 * Strict rate limiter for auth endpoints.
 */
export const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: "Too many sign-in attempts. Please wait 15 minutes.",
});

/**
 * OTP rate limiter.
 */
export const otpRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests. Please wait 5 minutes.",
});
