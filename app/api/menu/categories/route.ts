import { db } from "@/app/db";
import { categories } from "@/app/db/schema";
import { ok, serverError } from "@/lib/server/response";
import { asc, eq } from "drizzle-orm";

export async function GET() {
  try {
    const list = await db
      .select()
      .from(categories)
      .where(eq(categories.isActive, true))
      .orderBy(asc(categories.sortOrder));

    return ok(list);
  } catch {
    return serverError();
  }
}
