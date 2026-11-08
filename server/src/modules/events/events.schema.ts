import { z } from 'zod';

export const CreateEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  titleAm: z.string().optional(),
  description: z.string().optional(),
  descriptionAm: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  venue: z.string().optional(),
  venueAddress: z.string().optional(),
  city: z.string().default('Addis Ababa'),
  startAt: z.coerce.date(),
  endAt: z.coerce.date().optional(),
  imageUrl: z.string().optional(),
  totalCapacity: z.number().int().min(1, 'Capacity must be at least 1'),
  isFree: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'cancelled', 'completed']).default('draft'),
});

export type CreateEventInput = z.infer<typeof CreateEventSchema>;