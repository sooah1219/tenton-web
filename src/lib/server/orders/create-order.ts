import { db } from "@/app/db";
import {
  menuItems,
  optionGroups,
  options,
  orderLineItems,
  orderLineOptions,
  orders,
} from "@/app/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { calcTaxCents } from "./tax";

export async function createOrder(input: {
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    note?: string | null;
  };
  pickupAt: string;
  payMethod?: "store" | "card" | null;
  items: Array<{
    menuItemId: string;
    qty: number;
    note?: string | null;
    ramen?: {
      proteinOptionId: string;
      noodleOptionId: string;
      toppings: Array<{ optionId: string; qty: number }>;
      note?: string | null;
    } | null;
  }>;
}) {
  if (!input.items || input.items.length === 0) {
    throw new Error("No items.");
  }

  const payMethodRaw = (input.payMethod ?? "store").trim().toLowerCase();
  const payMethod = payMethodRaw === "card" ? 1 : 0;
  const paymentStatus = payMethod === 1 ? 1 : 0;

  const menuItemIds = [
    ...new Set(
      input.items
        .map((x) => (x.menuItemId ?? "").trim())
        .filter((x) => x.length > 0)
    ),
  ];

  if (menuItemIds.length === 0) {
    throw new Error("menuItemId is required.");
  }

  const menuRows = await db
    .select()
    .from(menuItems)
    .where(
      and(inArray(menuItems.id, menuItemIds), eq(menuItems.isActive, true))
    );

  const menuMap = new Map(menuRows.map((m) => [m.id, m]));

  const optionIds = [
    ...new Set(
      input.items
        .filter((i) => i.ramen)
        .flatMap((i) => [
          i.ramen!.proteinOptionId,
          i.ramen!.noodleOptionId,
          ...i.ramen!.toppings.map((t) => t.optionId),
        ])
        .map((x) => (x ?? "").trim())
        .filter((x) => x.length > 0)
    ),
  ];

  const optionRows =
    optionIds.length === 0
      ? []
      : await db
          .select({
            id: options.id,
            groupId: options.groupId,
            name: options.name,
            priceDeltaCents: options.priceDeltaCents,
            currency: options.currency,
            isActive: options.isActive,
            groupTitle: optionGroups.title,
          })
          .from(options)
          .leftJoin(optionGroups, eq(options.groupId, optionGroups.id))
          .where(
            and(inArray(options.id, optionIds), eq(options.isActive, true))
          );

  const optionMap = new Map(optionRows.map((o) => [o.id, o]));
  const now = new Date();

  const insertedOrders = await db
    .insert(orders)
    .values({
      status: 0,
      pickupAt: new Date(input.pickupAt),
      payMethod,
      paymentStatus,
      customerFirstName: (input.customer.firstName ?? "").trim(),
      customerLastName: (input.customer.lastName ?? "").trim(),
      customerPhone: (input.customer.phone ?? "").trim(),
      customerEmail: (input.customer.email ?? "").trim(),
      customerNote: input.customer.note?.trim() || null,
      currency: 0,
      subtotalCents: 0,
      taxCents: 0,
      totalCents: 0,
      createdAt: now,
      updatedAt: now,
    })
    .returning({ id: orders.id });

  const insertedOrder = insertedOrders[0];
  if (!insertedOrder) {
    throw new Error("Failed to create order.");
  }

  let subtotal = 0;

  for (const it of input.items) {
    const menuItemId = (it.menuItemId ?? "").trim();
    if (!menuItemId) {
      throw new Error("menuItemId is required.");
    }

    const menu = menuMap.get(menuItemId);
    if (!menu) {
      throw new Error(`Invalid menuItemId: ${menuItemId}`);
    }

    if (it.qty < 1 || it.qty > 50) {
      throw new Error("Invalid qty.");
    }

    const baseUnit = menu.priceCents;
    let extraPerUnit = 0;

    const collectedLineOptions: Array<{
      groupId: string;
      groupTitleSnapshot: string;
      optionId: string;
      optionNameSnapshot: string;
      unitPriceDeltaCentsSnapshot: number;
      qty: number;
    }> = [];

    if (it.ramen) {
      const proteinId = (it.ramen.proteinOptionId ?? "").trim();
      const noodleId = (it.ramen.noodleOptionId ?? "").trim();

      const protein = optionMap.get(proteinId);
      if (!proteinId || !protein) {
        throw new Error("Invalid protein option.");
      }

      const noodle = optionMap.get(noodleId);
      if (!noodleId || !noodle) {
        throw new Error("Invalid noodle option.");
      }

      collectedLineOptions.push({
        groupId: protein.groupId,
        groupTitleSnapshot: protein.groupTitle ?? "",
        optionId: protein.id,
        optionNameSnapshot: protein.name,
        unitPriceDeltaCentsSnapshot: protein.priceDeltaCents,
        qty: 1,
      });

      collectedLineOptions.push({
        groupId: noodle.groupId,
        groupTitleSnapshot: noodle.groupTitle ?? "",
        optionId: noodle.id,
        optionNameSnapshot: noodle.name,
        unitPriceDeltaCentsSnapshot: noodle.priceDeltaCents,
        qty: 1,
      });

      for (const t of it.ramen.toppings) {
        const optId = (t.optionId ?? "").trim();
        if (!optId) {
          throw new Error("Invalid topping option.");
        }

        if (t.qty < 1 || t.qty > 20) {
          throw new Error("Invalid topping qty.");
        }

        const top = optionMap.get(optId);
        if (!top) {
          throw new Error("Invalid topping option.");
        }

        extraPerUnit += top.priceDeltaCents * t.qty;

        collectedLineOptions.push({
          groupId: top.groupId,
          groupTitleSnapshot: top.groupTitle ?? "",
          optionId: top.id,
          optionNameSnapshot: top.name,
          unitPriceDeltaCentsSnapshot: top.priceDeltaCents,
          qty: t.qty,
        });
      }
    }

    const unitTotal = baseUnit + extraPerUnit;
    const lineSubtotal = unitTotal * it.qty;

    const insertedLineItems = await db
      .insert(orderLineItems)
      .values({
        orderId: insertedOrder.id,
        menuItemId: menu.id,
        itemNameSnapshot: menu.name,
        itemImageUrlSnapshot: menu.imageUrl,
        unitBasePriceCentsSnapshot: baseUnit,
        currency: menu.currency,
        qty: it.qty,
        note: it.note?.trim() || null,
        lineSubtotalCentsSnapshot: lineSubtotal,
        createdAt: now,
        updatedAt: now,
      })
      .returning({ id: orderLineItems.id });

    const insertedLineItem = insertedLineItems[0];
    if (!insertedLineItem) {
      throw new Error("Failed to create order line item.");
    }

    if (collectedLineOptions.length > 0) {
      await db.insert(orderLineOptions).values(
        collectedLineOptions.map((op) => ({
          orderLineItemId: insertedLineItem.id,
          groupId: op.groupId,
          groupTitleSnapshot: op.groupTitleSnapshot,
          optionId: op.optionId,
          optionNameSnapshot: op.optionNameSnapshot,
          unitPriceDeltaCentsSnapshot: op.unitPriceDeltaCentsSnapshot,
          qty: op.qty,
          createdAt: now,
          updatedAt: now,
        }))
      );
    }

    subtotal += lineSubtotal;
  }

  const tax = calcTaxCents(subtotal);
  const total = subtotal + tax;

  await db
    .update(orders)
    .set({
      subtotalCents: subtotal,
      taxCents: tax,
      totalCents: total,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, insertedOrder.id));

  return { orderId: insertedOrder.id };
}
