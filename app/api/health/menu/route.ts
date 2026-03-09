import { db } from "@/app/db";
import { categories } from "@/app/db/schema";

export async function GET() {
  try {
    const rows = await db.select().from(categories);
    return Response.json({
      ok: true,
      count: rows.length,
      rows,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ ok: false }, { status: 500 });
  }
}
