import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Password hashing for DEMO MODE ONLY.
 *
 * When Supabase is configured, authentication goes through Supabase Auth
 * (which handles password hashing server-side). This local implementation
 * exists solely so the MVP can be exercised without credentials; it uses
 * scrypt with a per-user salt, but is not a substitute for a real identity
 * provider in production.
 */

export function hashPassword(plain: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(plain, salt, 64);
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

export function verifyPassword(plain: string, stored: string): boolean {
  const [saltHex, hashHex] = stored.split(":");
  if (!saltHex || !hashHex) return false;
  const salt = Buffer.from(saltHex, "hex");
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(plain, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
