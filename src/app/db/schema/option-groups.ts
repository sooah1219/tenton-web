import {
  boolean,
  integer,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const optionGroups = pgTable("option_groups", {
  id: varchar("id", { length: 255 }).primaryKey(),

  kind: integer("kind").notNull(), // OptionGroupKind enum int
  title: varchar("title", { length: 120 }).notNull(),
  step: integer("step").notNull(),

  selection: integer("selection").notNull(), // OptionSelection enum int
  required: boolean("required").notNull(),

  minSelected: integer("min_selected").notNull(),
  maxSelected: integer("max_selected").notNull(),

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
