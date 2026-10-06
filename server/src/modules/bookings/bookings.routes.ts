import { Hono } from "hono";
import { z } from "zod";
import {
  listUserBookings,
  getBookingById,
  createBooking,
} from "./bookings.service.js";
import {
  CreateBookingSchema,
  ListBookingsSchema,
} from "./booking.validator.js";
import {
  requireAuth,
  optionalAuth,
} from "../../middleware/auth.middleware.js";
import { bookingRateLimit, apiRateLimit } from "../../middleware/rate-limit.js";
import { validateBody, validateQuery } from "../../middleware/validate.js";

export const bookingsRoutes = new Hono();

/**
 * GET /api/v1/bookings
 * Authenticated user — list their bookings.
 */
bookingsRoutes.get(
  "/",
  requireAuth,
  validateQuery(ListBookingsSchema),
  async (c) => {
    const query = c.get("validatedQuery") as z.infer<typeof ListBookingsSchema>;
    const result = await listUserBookings(c.var.user.id, query);
    return c.json(result);
  }
);

/**
 * GET /api/v1/bookings/:id
 * Authenticated user — get their booking detail with tickets.
 */
bookingsRoutes.get("/:id", requireAuth, apiRateLimit, async (c) => {
  const id = c.req.param("id");
  const booking = await getBookingById(id, c.var.user.id);
  return c.json({ booking });
});

/**
 * POST /api/v1/bookings
 * Create a new booking (reserved state).
 * Supports both authenticated users and guest checkout.
 */
bookingsRoutes.post(
  "/",
  optionalAuth,
  bookingRateLimit,
  validateBody(CreateBookingSchema),
  async (c) => {
    const body = c.get("validatedBody") as z.infer<typeof CreateBookingSchema>;
    const userId = c.var.user?.id;
    const booking = await createBooking(body, userId);
    return c.json({ booking }, 201);
  }
);
