import { ADMIN_COOKIE_NAME } from "@/lib/server/admin-auth-shared";
import { verifyAdminToken } from "@/lib/server/auth";
import { ok, unauthorized } from "@/lib/server/response";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  if (!token) return unauthorized();

  const decoded = verifyAdminToken(token);
  if (!decoded) return unauthorized();

  return ok([{ type: "role", value: decoded.role }]);
}
