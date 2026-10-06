import { Hono } from "hono";
import { z } from "zod";
import { searchEvents } from "./search.service.js";
import { apiRateLimit } from "../../middleware/rate-limit.js";
import { validateQuery } from "../../middleware/validate.js";

const SearchQuerySchema = z.object({
  q: z.string().max(200).optional(),
  category: z.string().optional(),
  city: z.string().optional(),
  isFree: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const searchRoutes = new Hono();

/**
 * GET /api/v1/search
 * Full-text and faceted event search via Meilisearch.
 */
searchRoutes.get(
  "/",
  apiRateLimit,
  validateQuery(SearchQuerySchema),
  async (c) => {
    const query = c.get("validatedQuery") as z.infer<typeof SearchQuerySchema>;
    const result = await searchEvents(query);
    return c.json(result);
  }
);
