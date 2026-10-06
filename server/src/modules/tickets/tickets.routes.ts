import { Hono } from "hono";
import { z } from "zod";
import {
  getTicketById,
  getTicketsByBooking,
  validateTicket,
} from "./tickets.service.js";
import { requireAuth, requireRole } from "../../middleware/auth.middleware.js";
import { apiRateLimit } from "../../middleware/rate-limit.js";
import { validateBody } from "../../middleware/validate.js";

const ScanSchema = z.object({
  qrUuid: z.string().uuid(),
});

export const ticketsRoutes = new Hono();

/**
 * GET /api/v1/tickets/:id
 * Authenticated attendee — get their ticket with QR payload.
 */
ticketsRoutes.get("/:id", requireAuth, apiRateLimit, async (c) => {
  const id = c.req.param("id");
  const ticket = await getTicketById(id, c.var.user.id);
  return c.json({ ticket });
});

/**
 * GET /api/v1/tickets/booking/:bookingId
 * Authenticated attendee — list all tickets for a booking.
 */
ticketsRoutes.get(
  "/booking/:bookingId",
  requireAuth,
  apiRateLimit,
  async (c) => {
    const bookingId = c.req.param("bookingId");
    const tickets = await getTicketsByBooking(bookingId, c.var.user.id);
    return c.json({ tickets });
  }
);

/**
 * POST /api/v1/tickets/validate
 * Organizer / Admin — scan and validate a QR ticket at the gate.
 */
ticketsRoutes.post(
  "/validate",
  requireAuth,
  requireRole("organizer", "admin"),
  validateBody(ScanSchema),
  async (c) => {
    const { qrUuid } = c.get("validatedBody") as z.infer<typeof ScanSchema>;
    const result = await validateTicket(qrUuid, c.var.user.id);
    const statusCode = result.valid ? 200 : 422;
    return c.json(result, statusCode);
  }
);
