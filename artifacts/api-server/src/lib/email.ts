import { randomInt, createHash } from "crypto";
import { Resend } from "resend";

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

let resend: Resend | undefined;

function getResendClient(): Resend {
  if (resend) return resend;

  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  resend = new Resend(apiKey);
  return resend;
}

/**
 * Sends the password-reset OTP to the user's email. Kept intentionally
 * simple (plain text + minimal HTML) — no template engine dependency.
 *
 * Uses Resend's "onboarding@resend.dev" sender, which works without
 * verifying a custom domain — but on Resend's free tier that sender can
 * only deliver to the email address the Resend account itself was signed
 * up with. Sending to other recipients requires verifying a domain in the
 * Resend dashboard and sending "from" that domain instead.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const { error } = await getResendClient().emails.send({
    from: "Dr.tragicMFA <onboarding@resend.dev>",
    to,
    subject: "Your password reset code",
    text: `Your password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`,
    html: `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`,
  });

  if (error) {
    throw new Error(`Failed to send OTP email: ${error.message}`);
  }
}
