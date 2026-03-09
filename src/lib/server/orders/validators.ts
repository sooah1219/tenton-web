import { z } from "zod";

export const ToppingPickSchema = z.object({
  optionId: z.string().min(1),
  qty: z.number().int().min(1).max(20),
});

export const RamenSelectionSchema = z.object({
  proteinOptionId: z.string().min(1),
  noodleOptionId: z.string().min(1),
  toppings: z.array(ToppingPickSchema).default([]),
  note: z.string().max(500).optional().nullable(),
});

export const CreateOrderItemSchema = z.object({
  menuItemId: z.string().min(1),
  qty: z.number().int().min(1).max(50),
  note: z.string().max(500).optional().nullable(),
  ramen: RamenSelectionSchema.optional().nullable(),
});

export const CreateOrderSchema = z.object({
  customer: z.object({
    firstName: z.string().min(1).max(50),
    lastName: z.string().min(1).max(50),
    phone: z.string().min(1).max(30),
    email: z.string().email().max(120),
    note: z.string().max(500).optional().nullable(),
  }),
  pickupAt: z.string().min(1),
  payMethod: z.enum(["store", "card"]).optional().nullable(),
  items: z.array(CreateOrderItemSchema).min(1),
});
