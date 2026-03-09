import {
  index,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { menuItems } from "./menu-items";
import { options } from "./options";

export const menuItemAllowedOptions = pgTable(
  "menu_item_allowed_options",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    menuItemId: varchar("menu_item_id", { length: 255 })
      .notNull()
      .references(() => menuItems.id, { onDelete: "cascade" }),

    optionId: varchar("option_id", { length: 255 })
      .notNull()
      .references(() => options.id, { onDelete: "cascade" }),

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
    menuItemOptionUnique: uniqueIndex(
      "ux_menu_item_allowed_options_menuitem_option"
    ).on(table.menuItemId, table.optionId),
    menuItemIdx: index("ix_menu_item_allowed_options_menu_item_id").on(
      table.menuItemId
    ),
    optionIdx: index("ix_menu_item_allowed_options_option_id").on(
      table.optionId
    ),
  })
);
