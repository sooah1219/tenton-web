import { db } from "@/app/db";
import { reservations } from "@/app/db/schema";
import { badRequest, notFound, ok } from "@/lib/server/response";
import { eq } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const rows = await db
      .select()
      .from(reservations)
      .where(eq(reservations.id, id))
      .limit(1);

    const item = rows[0];
    if (!item) return notFound();

    return ok(item);
  } catch {
    return badRequest("Invalid reservation id.");
  }
}
