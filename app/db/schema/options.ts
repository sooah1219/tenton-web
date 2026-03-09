import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { optionGroups } from "./option-groups";

export const options = pgTable("options", {
  id: varchar("id", { length: 255 }).primaryKey(),

  groupId: varchar("group_id", { length: 255 })
    .notNull()
    .references(() => optionGroups.id, { onDelete: "cascade" }),

  name: varchar("name", { length: 120 }).notNull(),
  description: varchar("description", { length: 1200 }),

  priceDeltaCents: integer("price_delta_cents").notNull(),
  currency: integer("currency").notNull(),

  imageUrl: varchar("image_url", { length: 600 }),

  maxQty: integer("max_qty"),
  defaultQty: integer("default_qty"),

  sortOrder: integer("sort_order").notNull(),
  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
