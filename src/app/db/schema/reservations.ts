import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const reservations = pgTable("reservations", {
  id: uuid("id").defaultRandom().primaryKey(),

  dateIso: varchar("date_iso", { length: 10 }).notNull(), // "2026-03-10"
  time: varchar("time", { length: 10 }).notNull(), // "11:30 AM"

  partySize: integer("party_size").notNull(),

  firstName: varchar("first_name", { length: 50 }).notNull(),
  lastName: varchar("last_name", { length: 50 }).notNull(),
  phone: varchar("phone", { length: 30 }).notNull(),
  email: varchar("email", { length: 120 }).notNull(),
  note: varchar("note", { length: 500 }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
