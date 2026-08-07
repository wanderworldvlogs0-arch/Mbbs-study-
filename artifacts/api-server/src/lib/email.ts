import { randomInt, createHash } from "crypto";
import nodemailer from "nodemailer";

const OTP_LENGTH = 6;

/**
 * Generates a random numeric OTP (e.g. "042917"). Uses crypto.randomInt so
 * it's not predictable like Math.random(), and zero-pads so the length is
 * always OTP_LENGTH digits.
 */
export function generateOtp(): string {
  const max = 10 ** OTP_LENGTH;
  const value = randomInt(0, max);
  return value.toString().padStart(OTP_LENGTH, "0");
}

/**
 * Only the SHA-256 hash of the OTP is stored in the database — mirrors
 * how sessions.ts hashes session tokens, so a DB leak alone can't be used
 * to reset someone's password.
 */
export function hashOtp(otp: string): string {
  return createHash("sha256").update(otp).digest("hex");
}

export function verifyOtp(otp: string, storedHash: string): boolean {
  return hashOtp(otp) === storedHash;
}

let transporter: nodemailer.Transporter | undefined;

function getTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("GMAIL_USER / GMAIL_APP_PASSWORD is not set");
  }

  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporter;
}

/**
 * Sends the password-reset OTP to the user's email. Kept intentionally
 * simple (plain text + minimal HTML) — no template engine dependency.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const from = process.env.GMAIL_USER;

  await getTransporter().sendMail({
    from: `"Dr.tragicMFA" <${from}>`,
    to,
    subject: "Your password reset code",
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  });
}
