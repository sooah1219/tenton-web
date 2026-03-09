import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const menuItems = pgTable("menu_items", {
  id: varchar("id", { length: 255 }).primaryKey(),

  categoryId: varchar("category_id", { length: 255 })
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),

  kind: integer("kind").notNull(), // MenuItemKind enum int
  name: varchar("name", { length: 120 }).notNull(),
  description: varchar("description", { length: 1200 }),

  priceCents: integer("price_cents").notNull(),
  currency: integer("currency").notNull(), // Currency enum int

  imageUrl: varchar("image_url", { length: 600 }),

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
