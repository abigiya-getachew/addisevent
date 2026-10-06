import { z } from "zod";

export const CreateEventSchema = z.object({
  title: z.string().min(3).max(255),
  titleAm: z.string().max(255).optional(),
  description: z.string().optional(),
  descriptionAm: z.string().optional(),
  category: z.string().min(1).max(100),
  venue: z.string().max(255).optional(),
  venueAddress: z.string().optional(),
  city: z.string().max(100).default("Addis Ababa"),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  imageUrl: z.string().url().optional(),
  totalCapacity: z.number().int().positive(),
  isFree: z.boolean().default(false),
  tags: z.array(z.string()).optional(),
  tiers: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        nameAm: z.string().max(100).optional(),
        price: z.string().regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
        currency: z.string().length(3).default("ETB"),
        totalQuantity: z.number().int().positive(),
        maxPerBooking: z.number().int().min(1).max(100).default(10),
        saleStartAt: z.string().datetime().optional(),
        saleEndAt: z.string().datetime().optional(),
      })
    )
    .min(1, "At least one ticket tier is required"),
});

export const UpdateEventSchema = CreateEventSchema.partial()
  .omit({ tiers: true })
  .extend({
    status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
  });

export const ListEventsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  category: z.string().optional(),
  city: z.string().optional(),
  status: z
    .enum(["draft", "published", "cancelled", "completed"])
    .optional()
    .default("published"),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  organizerId: z.string().uuid().optional(),
  q: z.string().max(200).optional(),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;
export type UpdateEventInput = z.infer<typeof UpdateEventSchema>;
export type ListEventsInput = z.infer<typeof ListEventsSchema>;
