import { db } from "@/app/db";
import { reservations } from "@/app/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { notFound, ok, serverError, unauthorized } from "@/lib/server/response";
import { eq, sql } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const { id } = await params;

    const rows = await db
      .select({
        id: reservations.id,
        reservedAt: sql<string>`${reservations.dateIso} || 'T' || ${reservations.time} || ':00'`,
        dateIso: reservations.dateIso,
        time: reservations.time,
        partySize: reservations.partySize,
        firstName: reservations.firstName,
        lastName: reservations.lastName,
        phone: reservations.phone,
        email: reservations.email,
        note: reservations.note,
        createdAt: reservations.createdAt,
        updatedAt: reservations.updatedAt,
      })
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);

    const item = rows[0];
    if (!item) return notFound();

    return ok(item);
  } catch {
    return serverError();
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const { id } = await params;

    const existing = await db
      .select({ id: reservations.id })
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);

    if (!existing[0]) return notFound();

    await db.delete(reservations).where(eq(reservations.id, id));

    return new Response(null, { status: 204 });
  } catch {
    return serverError();
  }
}
