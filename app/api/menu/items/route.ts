import { db } from "@/app/db";
import { menuItems } from "@/app/db/schema";
import { ok, serverError } from "@/lib/server/response";
import { and, asc, eq, ilike } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId");
    const q = searchParams.get("q");
    const includeInactive = searchParams.get("includeInactive") === "true";

    const conditions = [];

    if (!includeInactive) {
      conditions.push(eq(menuItems.isActive, true));
    }

    if (categoryId) {
      conditions.push(eq(menuItems.categoryId, categoryId));
    }

    if (q && q.trim()) {
      conditions.push(ilike(menuItems.name, `%${q.trim()}%`));
    }

    const list = await db
      .select()
      .from(menuItems)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(asc(menuItems.sortOrder));

    return ok(list);
  } catch {
    return serverError();
  }
}
