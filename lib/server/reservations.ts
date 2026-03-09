import { z } from "zod";

export const CreateReservationSchema = z.object({
  dateIso: z.string().min(1),
  time: z.string().min(1),
  partySize: z.number().int().min(1).max(50),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().min(1).max(30),
  email: z.string().email().max(120),
  note: z.string().max(500).optional().nullable(),
});
