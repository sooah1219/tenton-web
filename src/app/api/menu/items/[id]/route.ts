import { db } from "@/app/db";
import {
  menuItemOptionGroups,
  menuItems,
  optionGroups,
  options,
} from "@/app/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const itemRows = await db
    .select({
      id: menuItems.id,
      categoryId: menuItems.categoryId,
      kind: menuItems.kind,
      name: menuItems.name,
      description: menuItems.description,
      priceCents: menuItems.priceCents,
      imageUrl: menuItems.imageUrl,
    })
    .from(menuItems)
    .where(eq(menuItems.id, id))
    .limit(1);

  const item = itemRows[0];

  if (!item) {
    return Response.json({ error: "Menu item not found" }, { status: 404 });
  }

  const groupRows = await db
    .select({
      id: optionGroups.id,
      title: optionGroups.title,

      requiredOverride: menuItemOptionGroups.requiredOverride,
      minSelectedOverride: menuItemOptionGroups.minSelectedOverride,
      maxSelectedOverride: menuItemOptionGroups.maxSelectedOverride,
      sortOrderOverride: menuItemOptionGroups.sortOrder,

      requiredDefault: optionGroups.required,
      minSelectedDefault: optionGroups.minSelected,
      maxSelectedDefault: optionGroups.maxSelected,
      sortOrderDefault: optionGroups.sortOrder,
    })
    .from(menuItemOptionGroups)
    .innerJoin(optionGroups, eq(menuItemOptionGroups.groupId, optionGroups.id))
    .where(eq(menuItemOptionGroups.menuItemId, id))
    .orderBy(asc(menuItemOptionGroups.sortOrder));

  const groupIds = groupRows.map((g) => g.id);

  const optionRows =
    groupIds.length > 0
      ? await db
          .select({
            id: options.id,
            groupId: options.groupId,
            name: options.name,
            description: options.description,
            priceDeltaCents: options.priceDeltaCents,
            imageUrl: options.imageUrl,
            maxQty: options.maxQty,
            defaultQty: options.defaultQty,
            sortOrder: options.sortOrder,
            isActive: options.isActive,
          })
          .from(options)
          .where(inArray(options.groupId, groupIds))
          .orderBy(asc(options.sortOrder))
      : [];

  const optionGroupsWithOptions = groupRows.map((group) => ({
    id: group.id,
    title: group.title,
    required: group.requiredOverride ?? group.requiredDefault ?? false,
    minSelected: group.minSelectedOverride ?? group.minSelectedDefault ?? 0,
    maxSelected: group.maxSelectedOverride ?? group.maxSelectedDefault ?? 1,
    sortOrder: group.sortOrderOverride ?? group.sortOrderDefault ?? 0,
    options: optionRows
      .filter((opt) => opt.groupId === group.id && opt.isActive)
      .map((opt) => ({
        id: opt.id,
        groupId: opt.groupId,
        name: opt.name,
        description: opt.description,
        priceDeltaCents: opt.priceDeltaCents,
        imageUrl: opt.imageUrl,
        maxQty: opt.maxQty,
        defaultQty: opt.defaultQty,
        sortOrder: opt.sortOrder,
      })),
  }));

  return Response.json({
    ...item,
    optionGroups: optionGroupsWithOptions,
  });
}
