import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orders } from "./orders";

export const orderLineItems = pgTable("order_line_items", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderId: uuid("order_id")
    .notNull()
    .references(() => orders.id, { onDelete: "cascade" }),

  menuItemId: varchar("menu_item_id", { length: 255 }).notNull(),

  itemNameSnapshot: varchar("item_name_snapshot", { length: 200 }).notNull(),
  itemImageUrlSnapshot: varchar("item_image_url_snapshot", { length: 600 }),

  unitBasePriceCentsSnapshot: integer(
    "unit_base_price_cents_snapshot"
  ).notNull(),
  currency: integer("currency").notNull(),

  qty: integer("qty").notNull(),
  note: varchar("note", { length: 500 }),

  lineSubtotalCentsSnapshot: integer("line_subtotal_cents_snapshot").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
