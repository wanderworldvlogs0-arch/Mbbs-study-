import type { NextFunction, Request, Response } from "express";
import { eq, gt, and } from "drizzle-orm";
import { db, sessionsTable, usersTable, type PublicUser } from "@workspace/db";
import { SESSION_COOKIE_NAME, hashSessionToken } from "../lib/auth";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: PublicUser;
    }
  }
}

/**
 * Looks up the session cookie (if any) and attaches the signed-in user to
 * `req.user`. Never rejects the request — use `requireAuth` for routes that
 * must be authenticated.
 */
export async function attachUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;
  if (!token) {
    next();
    return;
  }

  const tokenHash = hashSessionToken(token);

  const rows = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      email: usersTable.email,
      academicYear: usersTable.academicYear,
      mobileNumber: usersTable.mobileNumber,
      profilePhoto: usersTable.profilePhoto
    })
    .from(sessionsTable)
    .innerJoin(usersTable, eq(sessionsTable.userId, usersTable.id))
    .where(
      and(
        eq(sessionsTable.id, tokenHash),
        gt(sessionsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);

  req.user = rows[0];
  next();
}

export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ message: "Not signed in" });
    return;
  }
  next();
}
