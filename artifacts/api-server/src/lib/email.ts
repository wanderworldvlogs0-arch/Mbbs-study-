import { randomInt, createHash } from "crypto";
import * as brevo from "@getbrevo/brevo";

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

let apiInstance: brevo.TransactionalEmailsApi | undefined;

function ensureInitialized(): brevo.TransactionalEmailsApi {
  if (apiInstance) return apiInstance;

  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not set");
  }

  apiInstance = new brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);

  return apiInstance;
}

/**
 * Sends the password-reset OTP to the user's email. Kept intentionally
 * simple (plain text + minimal HTML) — no template engine dependency.
 *
 * Uses Brevo's HTTP API (not SMTP) — Render's free tier blocks
 * outbound SMTP ports, so an HTTP-based provider is required.
 *
 * `BREVO_FROM_EMAIL` should ideally be a verified sender in Brevo
 * dashboard under Senders, Domains & Dedicated IPs → Senders.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const api = ensureInitialized();

  const from = process.env.BREVO_FROM_EMAIL;
  if (!from) {
    throw new Error("BREVO_FROM_EMAIL is not set");
  }

  const message = new brevo.SendSmtpEmail();
  message.sender = { email: from };
  message.to = [{ email: to }];
  message.subject = "Your password reset code";
  message.textContent = `Your password reset code is ${otp}. It expires in 10 minutes. If you didn't request this, you can ignore this email.`;
  message.htmlContent = `<p>Your password reset code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`;

  await api.sendTransacEmail(message);
}
