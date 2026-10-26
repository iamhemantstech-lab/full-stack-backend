import rateLimit from "express-rate-limit";
import { ApiError } from "../utils/ApiError.js";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Only count failed attempts (4xx / 5xx)
  handler: (_) => {
    throw new ApiError(
      429,
      "Too many login attempts from this IP address. Please try again after 15 minutes."
    );
  },
});
