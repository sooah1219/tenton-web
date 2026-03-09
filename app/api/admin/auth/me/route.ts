import { getAdminSession } from "@/lib/server/auth";
import { ok, unauthorized } from "@/lib/server/response";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return unauthorized();

  return ok({
    role: admin.role,
  });
}
