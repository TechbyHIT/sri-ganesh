import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const cookieName = "admin_session";

export function adminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12);
}

export function adminToken(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

export function tokensMatch(left: string, right: string): boolean {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

export async function isAdmin(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    return false;
  }

  const jar = await cookies();
  const session = jar.get(cookieName)?.value;

  if (!session) {
    return false;
  }

  return tokensMatch(session, adminToken(password));
}

export { cookieName };
