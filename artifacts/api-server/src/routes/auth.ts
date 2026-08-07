import { Router, type IRouter } from "express";
import { eq, and, gt, desc } from "drizzle-orm";
import rateLimit from "express-rate-limit";
import { db, usersTable, sessionsTable, passwordResetsTable } from "@workspace/db";
import { SignUpBody, SignInBody, AuthUserSchema } from "@workspace/api-zod";
import {
  hashPassword,
  verifyPassword,
  generateSessionToken,
  hashSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_TTL_MS,
} from "../lib/auth";
import { generateOtp, hashOtp, verifyOtp, sendOtpEmail } from "../lib/email";
import { requireAuth } from "../middlewares/require-auth";

const router: IRouter = Router();

const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_OTP_ATTEMPTS = 5;

// Applies to all three password-reset endpoints — keeps someone from
// hammering the mail server or brute-forcing an OTP.
const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

async function createSessionAndRespond(
  res: import("express").Response,
  user: {
    id: string;
    name: string;
    email: string;
    academicYear: string | null;
    mobileNumber?: string | null;
    profilePhoto?: string | null;
  },
  statusCode: number,
): Promise<void> {
  const token = generateSessionToken();

  await db.insert(sessionsTable).values({
    id: hashSessionToken(token),
    userId: user.id,
    expiresAt: new Date(Date.now() + SESSION_TTL_MS),
  });

  res.cookie(SESSION_COOKIE_NAME, token, {
    ...COOKIE_OPTIONS,
    maxAge: SESSION_TTL_MS,
  });

  res.status(statusCode).json(
    AuthUserSchema.parse({
      id: user.id,
      name: user.name,
      email: user.email,
      academicYear: user.academicYear,
      mobileNumber: user.mobileNumber,
      profilePhoto: user.profilePhoto,
    }),
  );
}

router.post("/auth/signup", async (req, res) => {
  const parsed = SignUpBody.safeParse(req.body);

  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: parsed.error.issues[0]?.message ?? "Invalid request" });
  }

  const { name, email, password, academicYear } = parsed.data;

  const existing = await db
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (existing.length > 0) {
    return res
      .status(409)
      .json({ message: "That email is already registered" });
  }

  const passwordHash = await hashPassword(password);

  const [user] = await db
    .insert(usersTable)
    .values({
      name,
      email,
      passwordHash,
      academicYear,
    })
    .returning();

  if (!user) {
    return res.status(500).json({ message: "Failed to create account" });
  }

  await createSessionAndRespond(res, user, 201);
});

router.post("/auth/signin", async (req, res) => {
  const parsed = SignInBody.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const { email, password } = parsed.data;

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return res
      .status(401)
      .json({ message: "Invalid email or password" });
  }

  await createSessionAndRespond(res, user, 200);
});

router.post("/auth/logout", async (req, res) => {
  const token = req.cookies?.[SESSION_COOKIE_NAME] as string | undefined;

  if (token) {
    await db
      .delete(sessionsTable)
      .where(eq(sessionsTable.id, hashSessionToken(token)));
  }

  res.clearCookie(SESSION_COOKIE_NAME, COOKIE_OPTIONS);
  res.status(204).end();
});

router.put("/auth/profile", requireAuth, async (req, res) => {
  const { name, email, academicYear, mobileNumber, profilePhoto } = req.body;

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      name,
      email,
      academicYear,
      mobileNumber,
      profilePhoto,
    })
    .where(eq(usersTable.id, req.user!.id))
    .returning();

  res.json(
    AuthUserSchema.parse({
      id: updatedUser!.id,
      name: updatedUser!.name,
      email: updatedUser!.email,
      academicYear: updatedUser!.academicYear,
      mobileNumber: updatedUser!.mobileNumber,
      profilePhoto: updatedUser!.profilePhoto,
    }),
  );
});
router.put("/auth/change-password", requireAuth, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "Current and new password are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters" });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, req.user.id))
    .limit(1);

  if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
    return res.status(401).json({ message: "Current password is incorrect" });
  }

  const newPasswordHash = await hashPassword(newPassword);

  await db
    .update(usersTable)
    .set({ passwordHash: newPasswordHash })
    .where(eq(usersTable.id, req.user.id));

  res.status(200).json({ message: "Password updated successfully" });
});
router.get("/auth/me", requireAuth, (req, res) => {
  res.json(AuthUserSchema.parse(req.user));
});

router.post("/auth/forgot-password", passwordResetLimiter, async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  // Always return the same response whether or not the account exists —
  // otherwise this endpoint could be used to check which emails are
  // registered.
  if (user) {
    const otp = generateOtp();

    await db.insert(passwordResetsTable).values({
      userId: user.id,
      otpHash: hashOtp(otp),
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    });

    try {
      await sendOtpEmail(user.email, otp);
    } catch (err) {
      req.log.error({ err }, "Failed to send password reset email");
    }
  }

  res
    .status(200)
    .json({ message: "If that email is registered, a code has been sent." });
});

router.post("/auth/verify-otp", passwordResetLimiter, async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and code are required" });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const [reset] = await db
    .select()
    .from(passwordResetsTable)
    .where(
      and(
        eq(passwordResetsTable.userId, user.id),
        eq(passwordResetsTable.consumed, false),
        gt(passwordResetsTable.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(passwordResetsTable.createdAt))
    .limit(1);

  if (!reset || reset.attempts >= MAX_OTP_ATTEMPTS) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  if (!verifyOtp(otp, reset.otpHash)) {
    await db
      .update(passwordResetsTable)
      .set({ attempts: reset.attempts + 1 })
      .where(eq(passwordResetsTable.id, reset.id));

    return res.status(400).json({ message: "Invalid or expired code" });
  }

  // Not marked consumed here — the same OTP is presented again to
  // /auth/reset-password, which does the actual consuming. This endpoint
  // just lets the UI confirm the code before showing the new-password step.
  res.status(200).json({ message: "Code verified" });
});

router.post("/auth/reset-password", passwordResetLimiter, async (req, res) => {
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const otp = typeof req.body?.otp === "string" ? req.body.otp.trim() : "";
  const newPassword =
    typeof req.body?.newPassword === "string" ? req.body.newPassword : "";

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, code, and new password are required" });
  }

  if (newPassword.length < 8) {
    return res
      .status(400)
      .json({ message: "New password must be at least 8 characters" });
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, email))
    .limit(1);

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const [reset] = await db
    .select()
    .from(passwordResetsTable)
    .where(
      and(
        eq(passwordResetsTable.userId, user.id),
        eq(passwordResetsTable.consumed, false),
        gt(passwordResetsTable.expiresAt, new Date()),
      ),
    )
    .orderBy(desc(passwordResetsTable.createdAt))
    .limit(1);

  if (!reset || reset.attempts >= MAX_OTP_ATTEMPTS || !verifyOtp(otp, reset.otpHash)) {
    if (reset) {
      await db
        .update(passwordResetsTable)
        .set({ attempts: reset.attempts + 1 })
        .where(eq(passwordResetsTable.id, reset.id));
    }

    return res.status(400).json({ message: "Invalid or expired code" });
  }

  const passwordHash = await hashPassword(newPassword);

  await db
    .update(usersTable)
    .set({ passwordHash })
    .where(eq(usersTable.id, user.id));

  await db
    .update(passwordResetsTable)
    .set({ consumed: true })
    .where(eq(passwordResetsTable.id, reset.id));

  res.status(200).json({ message: "Password reset successfully" });
});

export default router;
