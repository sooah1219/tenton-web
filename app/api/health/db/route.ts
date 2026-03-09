import { db } from "@/app/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db.execute(sql`select now() as now`);
    return Response.json({
      ok: true,
      now: result.rows[0]?.now ?? null,
    });
  } catch (error) {
    console.error(error);
    return Response.json(
      { ok: false, error: "DB connection failed" },
      { status: 500 }
    );
  }
}
