import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { orderLineItems } from "./order-line-items";

export const orderLineOptions = pgTable("order_line_options", {
  id: uuid("id").defaultRandom().primaryKey(),

  orderLineItemId: uuid("order_line_item_id")
    .notNull()
    .references(() => orderLineItems.id, { onDelete: "cascade" }),

  groupId: varchar("group_id", { length: 255 }).notNull(),
  groupTitleSnapshot: varchar("group_title_snapshot", {
    length: 120,
  }).notNull(),

  optionId: varchar("option_id", { length: 255 }).notNull(),
  optionNameSnapshot: varchar("option_name_snapshot", {
    length: 120,
  }).notNull(),

  unitPriceDeltaCentsSnapshot: integer(
    "unit_price_delta_cents_snapshot"
  ).notNull(),
  qty: integer("qty").notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
