import rateLimit from "express-rate-limit";

/**
 * Throttles sign-in attempts per IP so a script can't brute-force
 * passwords. Successful requests aren't counted, only failed ones -
 * a legitimate user typing their password correctly won't get blocked.
 */
export const signInRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // 10 failed attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { message: "Too many login attempts. Please try again later." },
});

/**
 * Throttles account creation per IP to slow down mass fake-signup /
 * email-enumeration scripts.
 */
export const signUpRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: 10, // 10 signups per IP per hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many accounts created. Please try again later." },
});
