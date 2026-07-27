import { randomBytes, scrypt, timingSafeEqual, createHash } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;

/**
 * Hashes a plaintext password using scrypt with a random per-password salt.
 * Stored as `salt:hash` (both hex). No extra dependency needed — scrypt is
 * built into Node's crypto module and is a solid choice for password hashing.
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = (await scryptAsync(
    password,
    salt,
    KEY_LENGTH,
  )) as Buffer;
  return `${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(
  password: string,
  storedHash: string,
): Promise<boolean> {
  const [salt, hashHex] = storedHash.split(":");
  if (!salt || !hashHex) return false;

  const derivedKey = (await scryptAsync(
    password,
    salt,
    KEY_LENGTH,
  )) as Buffer;
  const storedKey = Buffer.from(hashHex, "hex");

  if (derivedKey.length !== storedKey.length) return false;
  return timingSafeEqual(derivedKey, storedKey);
}

export const SESSION_COOKIE_NAME = "session_token";
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * Generates a random session token. The raw token goes in the user's
 * cookie; only its SHA-256 hash is stored in the `sessions` table, so a
 * database leak alone can't be used to hijack a session.
 */
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
