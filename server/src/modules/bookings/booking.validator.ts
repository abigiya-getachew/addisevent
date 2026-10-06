import { z } from "zod";

export const CreateBookingSchema = z.object({
  eventId: z.string().uuid(),
  tierId: z.string().uuid(),
  quantity: z.number().int().min(1).max(20),
  paymentMethod: z.enum(["telebirr", "cbebirr", "chapa", "pay_at_gate"]),
  // Guest checkout fields — required when no auth token present
  guestPhone: z.string().min(9).max(20).optional(),
  guestName: z.string().min(1).max(255).optional(),
});

export const ConfirmBookingSchema = z.object({
  bookingId: z.string().uuid(),
  transactionId: z.string().min(1),
  gatewayPayload: z.record(z.string(), z.unknown()).optional(),
});

export const ListBookingsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z
    .enum(["pending", "reserved", "paid", "failed", "expired", "refunded"])
    .optional(),
  eventId: z.string().uuid().optional(),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type ConfirmBookingInput = z.infer<typeof ConfirmBookingSchema>;
export type ListBookingsInput = z.infer<typeof ListBookingsSchema>;
