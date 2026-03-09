import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "admin_token";

type AdminJwtPayload = {
  role: "Admin";
};

export function signAdminToken() {
  const secret = process.env.ADMIN_JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_JWT_SECRET must be 32+ chars");
  }

  return jwt.sign({ role: "Admin" }, secret, {
    expiresIn: "12h",
  });
}

export function verifyAdminToken(token: string): AdminJwtPayload | null {
  try {
    const secret = process.env.ADMIN_JWT_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error("ADMIN_JWT_SECRET must be 32+ chars");
    }

    const decoded = jwt.verify(token, secret);

    if (
      typeof decoded === "object" &&
      decoded &&
      "role" in decoded &&
      decoded.role === "Admin"
    ) {
      return { role: "Admin" };
    }

    return null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function requireAdmin() {
  return await getAdminSession();
}
