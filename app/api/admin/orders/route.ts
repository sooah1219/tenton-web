import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { orderStatusToString } from "@/lib/server/orders/enums";
import { ok, serverError, unauthorized } from "@/lib/server/response";
import { desc, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const rows = !status
      ? await db
          .select()
          .from(orders)
          .orderBy(desc(orders.createdAt))
          .limit(200)
      : status === "CONFIRMED" || status === "CANCELLED"
      ? await db
          .select()
          .from(orders)
          .where(eq(orders.status, status === "CONFIRMED" ? 0 : 1))
          .orderBy(desc(orders.createdAt))
          .limit(200)
      : [];

    return ok(
      rows.map((o) => ({
        id: o.id,
        status: orderStatusToString(o.status),
        createdAt: o.createdAt,
        pickupAt: o.pickupAt,
        totalCents: o.totalCents,
        customerName: `${o.customerFirstName} ${o.customerLastName}`.trim(),
      }))
    );
  } catch {
    return serverError();
  }
}
