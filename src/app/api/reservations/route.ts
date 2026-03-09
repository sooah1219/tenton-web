import { db } from "@/app/db";
import { reservations } from "@/app/db/schema";
import { nowUtc } from "@/lib/server/now";
import { CreateReservationSchema } from "@/lib/server/reservations";
import { created, ok, serverError } from "@/lib/server/response";
import { asc, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("POST /api/reservations body:", JSON.stringify(body, null, 2));

    const parsed = CreateReservationSchema.safeParse(body);

    if (!parsed.success) {
      const flattened = parsed.error.flatten();
      console.error("CreateReservationSchema error:", flattened);

      return Response.json(
        {
          message: "Invalid reservation payload",
          errors: flattened,
        },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const now = nowUtc();

    const inserted = await db
      .insert(reservations)
      .values({
        dateIso: data.dateIso.trim(),
        time: data.time.trim(),
        partySize: data.partySize,
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        phone: data.phone.trim(),
        email: data.email.trim(),
        note: data.note?.trim() || null,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    const entity = inserted[0];
    return created(entity);
  } catch (error) {
    console.error("POST /api/reservations failed");
    console.error(error);
    return serverError(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date")?.trim();

    if (date) {
      const items = await db
        .select()
        .from(reservations)
        .where(eq(reservations.dateIso, date))
        .orderBy(
          asc(reservations.dateIso),
          asc(reservations.time),
          asc(reservations.createdAt)
        )
        .limit(500);

      return ok(items);
    }

    const items = await db
      .select()
      .from(reservations)
      .orderBy(
        asc(reservations.dateIso),
        asc(reservations.time),
        asc(reservations.createdAt)
      )
      .limit(500);

    return ok(items);
  } catch (error) {
    console.error("GET /api/reservations failed");
    console.error(error);
    return serverError(
      error instanceof Error ? error.message : "Internal server error"
    );
  }
}
