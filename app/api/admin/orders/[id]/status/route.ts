import { db } from "@/app/db";
import { orders } from "@/app/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { orderStatusFromString } from "@/lib/server/orders/enums";
import {
  badRequest,
  notFound,
  serverError,
  unauthorized,
} from "@/lib/server/response";
import { eq } from "drizzle-orm";
import { z } from "zod";

const BodySchema = z.object({
  status: z.union([z.literal("CONFIRMED"), z.literal("CANCELLED")]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const { id } = await params;

    const body = await req.json();
    const parsed = BodySchema.safeParse(body);
    if (!parsed.success) {
      return badRequest("Invalid status.");
    }

    const nextStatus = orderStatusFromString(parsed.data.status);
    if (nextStatus === null) {
      return badRequest("Invalid status.");
    }

    const existing = await db
      .select({ id: orders.id })
      .from(orders)
      .where(eq(orders.id, id))
      .limit(1);

    if (!existing[0]) return notFound();

    await db
      .update(orders)
      .set({
        status: nextStatus,
        updatedAt: new Date(),
      })
      .where(eq(orders.id, id));

    return new Response(null, { status: 204 });
  } catch {
    return serverError();
  }
}
