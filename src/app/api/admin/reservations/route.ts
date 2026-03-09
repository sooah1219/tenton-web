import { db } from "@/app/db";
import { reservations } from "@/app/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { ok, serverError, unauthorized } from "@/lib/server/response";
import { asc, sql } from "drizzle-orm";

export async function GET() {
  try {
    const admin = await requireAdmin();
    if (!admin) return unauthorized();

    const rows = await db
      .select({
        id: reservations.id,
        reservedAt: sql<string>`${reservations.dateIso} || 'T' || ${reservations.time} || ':00'`,
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
      .orderBy(asc(reservations.dateIso), asc(reservations.time));

    return ok(rows);
  } catch {
    return serverError();
  }
}
