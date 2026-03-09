import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: varchar("id", { length: 255 }).primaryKey(),

  name: varchar("name", { length: 80 }).notNull(),
  icon: varchar("icon", { length: 400 }),

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
