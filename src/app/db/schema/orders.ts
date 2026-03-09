import {
  integer,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const orders = pgTable("orders", {
  id: uuid("id").defaultRandom().primaryKey(),

  status: integer("status").notNull(), // OrderStatus enum int
  currency: integer("currency").notNull(), // Currency enum int

  subtotalCents: integer("subtotal_cents").notNull(),
  taxCents: integer("tax_cents").notNull(),
  totalCents: integer("total_cents").notNull(),

  pickupAt: timestamp("pickup_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  payMethod: integer("pay_method").notNull(), // PayMethod enum int
  paymentStatus: integer("payment_status").notNull(), // PaymentStatus enum int

  customerFirstName: varchar("customer_first_name", { length: 50 }).notNull(),
  customerLastName: varchar("customer_last_name", { length: 50 }).notNull(),
  customerPhone: varchar("customer_phone", { length: 30 }).notNull(),
  customerEmail: varchar("customer_email", { length: 120 }).notNull(),
  customerNote: varchar("customer_note", { length: 500 }),

  createdAt: timestamp("created_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});
