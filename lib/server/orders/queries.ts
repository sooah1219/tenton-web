import { db } from "@/app/db";
import { orderLineItems, orderLineOptions, orders } from "@/app/db/schema";
import { desc, eq, inArray } from "drizzle-orm";
import { toOrderDTO } from "./mappers";

export async function getOrdersWithDetails(limit = 50) {
  const safeLimit = Math.min(Math.max(limit, 1), 200);

  const orderRows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt))
    .limit(safeLimit);

  if (orderRows.length === 0) {
    return [];
  }

  const orderIds = orderRows.map((o) => o.id);

  const lineItemRows = await db
    .select()
    .from(orderLineItems)
    .where(inArray(orderLineItems.orderId, orderIds));

  const lineItemIds = lineItemRows.map((li) => li.id);

  const lineOptionRows =
    lineItemIds.length === 0
      ? []
      : await db
          .select()
          .from(orderLineOptions)
          .where(inArray(orderLineOptions.orderLineItemId, lineItemIds));

  return orderRows.map((order) => {
    const itemsForOrder = lineItemRows.filter((li) => li.orderId === order.id);
    const itemIdsForOrder = itemsForOrder.map((li) => li.id);
    const optionsForOrder = lineOptionRows.filter((op) =>
      itemIdsForOrder.includes(op.orderLineItemId)
    );

    return toOrderDTO(order, itemsForOrder, optionsForOrder);
  });
}

export async function getOrderWithDetails(orderId: string) {
  const orderRows = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId))
    .limit(1);

  const order = orderRows[0];
  if (!order) return null;

  const lineItemRows = await db
    .select()
    .from(orderLineItems)
    .where(eq(orderLineItems.orderId, orderId));

  const lineItemIds = lineItemRows.map((li) => li.id);

  const lineOptionRows =
    lineItemIds.length === 0
      ? []
      : await db
          .select()
          .from(orderLineOptions)
          .where(inArray(orderLineOptions.orderLineItemId, lineItemIds));

  return toOrderDTO(order, lineItemRows, lineOptionRows);
}

export async function getOrderByIdWithDetails(orderId: string) {
  return getOrderWithDetails(orderId);
}
