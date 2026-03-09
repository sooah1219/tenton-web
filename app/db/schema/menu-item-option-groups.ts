import {
  boolean,
  index,
  integer,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { menuItems } from "./menu-items";
import { optionGroups } from "./option-groups";

export const menuItemOptionGroups = pgTable(
  "menu_item_option_groups",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    menuItemId: varchar("menu_item_id", { length: 255 })
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),

    groupId: varchar("group_id", { length: 255 })
      .notNull()
      .references(() => optionGroups.id, { onDelete: "cascade" }),

    requiredOverride: boolean("required_override"),
    minSelectedOverride: integer("min_selected_override"),
    maxSelectedOverride: integer("max_selected_override"),

    sortOrder: integer("sort_order").notNull(),

    createdAt: timestamp("created_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),

    updatedAt: timestamp("updated_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => ({
    menuItemGroupUnique: uniqueIndex(
      "ux_menu_item_option_groups_menuitem_group"
    ).on(table.menuItemId, table.groupId),
    menuItemIdx: index("ix_menu_item_option_groups_menu_item_id").on(
      table.menuItemId
    ),
    groupIdx: index("ix_menu_item_option_groups_group_id").on(table.groupId),
  })
);
