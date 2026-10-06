import { Hono } from "hono";
import { z } from "zod";
import {
  listEvents,
  getEventById,
  createEvent,
  updateEvent,
  publishEvent,
  cancelEvent,
  deleteEvent,
} from "./events.service.js";
import {
  CreateEventSchema,
  UpdateEventSchema,
  ListEventsSchema,
} from "./events.validator.js";
import {
  requireAuth,
  requireRole,
} from "../../middleware/auth.middleware.js";
import { apiRateLimit } from "../../middleware/rate-limit.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";

export const eventsRoutes = new Hono();

/**
 * GET /api/v1/events
 * Public — list published events with filters.
 */
eventsRoutes.get(
  "/",
  apiRateLimit,
  validateQuery(ListEventsSchema),
  async (c) => {
    const query = c.get("validatedQuery") as z.infer<typeof ListEventsSchema>;
    const result = await listEvents(query);
    return c.json(result);
  }
);

/**
 * GET /api/v1/events/:id
 * Public — get a single event with its ticket tiers.
 */
eventsRoutes.get("/:id", apiRateLimit, async (c) => {
  const id = c.req.param("id");
  const event = await getEventById(id);
  return c.json({ event });
});

/**
 * POST /api/v1/events
 * Organizer — create a new event with tiers.
 */
eventsRoutes.post(
  "/",
  requireAuth,
  requireRole("organizer", "admin"),
  validateBody(CreateEventSchema),
  async (c) => {
    const body = c.get("validatedBody") as z.infer<typeof CreateEventSchema>;
    const event = await createEvent(c.var.user.id, body);
    return c.json({ event }, 201);
  }
);

/**
 * PATCH /api/v1/events/:id
 * Organizer — update event metadata.
 */
eventsRoutes.patch(
  "/:id",
  requireAuth,
  requireRole("organizer", "admin"),
  validateBody(UpdateEventSchema),
  async (c) => {
    const id = c.req.param("id");
    const body = c.get("validatedBody") as z.infer<typeof UpdateEventSchema>;
    const event = await updateEvent(id, c.var.user.id, body);
    return c.json({ event });
  }
);

/**
 * POST /api/v1/events/:id/publish
 * Organizer — move event from draft → published.
 */
eventsRoutes.post(
  "/:id/publish",
  requireAuth,
  requireRole("organizer", "admin"),
  async (c) => {
    const id = c.req.param("id");
    const event = await publishEvent(id, c.var.user.id);
    return c.json({ event });
  }
);

/**
 * POST /api/v1/events/:id/cancel
 * Organizer — cancel a published event.
 */
eventsRoutes.post(
  "/:id/cancel",
  requireAuth,
  requireRole("organizer", "admin"),
  async (c) => {
    const id = c.req.param("id");
    const event = await cancelEvent(id, c.var.user.id);
    return c.json({ event });
  }
);

/**
 * DELETE /api/v1/events/:id
 * Organizer — delete a draft event.
 */
eventsRoutes.delete(
  "/:id",
  requireAuth,
  requireRole("organizer", "admin"),
  async (c) => {
    const id = c.req.param("id");
    await deleteEvent(id, c.var.user.id);
    return c.json({ success: true }, 200);
  }
);
