import type { NextFunction, Request, Response } from "express";

/**
 * Reads the ADMIN_EMAILS environment variable (comma-separated list of
 * email addresses) and blocks the request unless the signed-in user's
 * email is in that list. Must run after `attachUser`/`requireAuth`.
 *
 * Set this on Render under your service's Environment tab, e.g.:
 *   ADMIN_EMAILS=you@example.com,co-admin@example.com
 */
export function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ message: "Not signed in" });
    return;
  }

  const adminEmails = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (!adminEmails.includes(req.user.email.toLowerCase())) {
    res.status(403).json({ message: "Admin access required" });
    return;
  }

  next();
}
