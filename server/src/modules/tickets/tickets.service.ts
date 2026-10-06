import { eq, and } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../../db/index.js";
import { generateQRPayload } from "../../utils/qr.js";
import type { Booking } from "../../db/schema.js";

// ─── Types ────────────────────────────────────────────────────────────────────

type TxClient = Parameters<Parameters<typeof db.transaction>[0]>[0];

// ─── Generate tickets after a confirmed booking ───────────────────────────────

/**
 * Creates one ticket row per seat in the booking.
 * Called inside the confirmBooking transaction.
 */
export async function generateTicketsForBooking(
  tx: TxClient,
  booking: Booking
) {
  const ticketRows = Array.from({ length: booking.quantity }, () => ({
    bookingId: booking.id,
    status: "issued" as const,
  }));

  const inserted = await tx
    .insert(schema.tickets)
    .values(ticketRows)
    .returning();

  return inserted;
}

// ─── Get ticket by ID ─────────────────────────────────────────────────────────

export async function getTicketById(ticketId: string, userId?: string) {
  const [ticket] = await db
    .select({
      ticket: schema.tickets,
      booking: schema.bookings,
    })
    .from(schema.tickets)
    .innerJoin(
      schema.bookings,
      eq(schema.tickets.bookingId, schema.bookings.id)
    )
    .where(eq(schema.tickets.id, ticketId))
    .limit(1);

  if (!ticket) {
    throw new HTTPException(404, { message: "Ticket not found" });
  }

  // Enforce ownership: attendee can only see their own tickets
  if (userId && ticket.booking.userId !== userId) {
    throw new HTTPException(403, { message: "Access denied" });
  }

  const qrPayload = generateQRPayload(ticket.ticket.qrUuid);
  return { ...ticket.ticket, qrPayload };
}

// ─── Get all tickets for a booking ────────────────────────────────────────────

export async function getTicketsByBooking(bookingId: string, userId?: string) {
  // Verify booking ownership
  if (userId) {
    const [booking] = await db
      .select({ userId: schema.bookings.userId })
      .from(schema.bookings)
      .where(eq(schema.bookings.id, bookingId))
      .limit(1);

    if (!booking) throw new HTTPException(404, { message: "Booking not found" });
    if (booking.userId !== userId) {
      throw new HTTPException(403, { message: "Access denied" });
    }
  }

  const tickets = await db
    .select()
    .from(schema.tickets)
    .where(eq(schema.tickets.bookingId, bookingId));

  return tickets.map((t) => ({
    ...t,
    qrPayload: generateQRPayload(t.qrUuid),
  }));
}

// ─── Validate (scan) a ticket ─────────────────────────────────────────────────

export async function validateTicket(
  qrUuid: string,
  scannedByUserId: string
) {
  return await db.transaction(async (tx) => {
    const [ticket] = await tx
      .select({
        ticket: schema.tickets,
        booking: schema.bookings,
      })
      .from(schema.tickets)
      .innerJoin(
        schema.bookings,
        eq(schema.tickets.bookingId, schema.bookings.id)
      )
      .where(eq(schema.tickets.qrUuid, qrUuid))
      .limit(1)
      .for("update");

    if (!ticket) {
      return { valid: false, reason: "Ticket not found" };
    }

    if (ticket.booking.status !== "paid") {
      return { valid: false, reason: "Booking is not confirmed" };
    }

    if (ticket.ticket.status === "scanned") {
      return {
        valid: false,
        reason: "Ticket already scanned",
        scannedAt: ticket.ticket.scannedAt,
      };
    }

    if (ticket.ticket.status === "cancelled") {
      return { valid: false, reason: "Ticket is cancelled" };
    }

    // Mark as scanned
    const [updated] = await tx
      .update(schema.tickets)
      .set({
        status: "scanned",
        scannedAt: new Date(),
        scannedBy: scannedByUserId,
      })
      .where(eq(schema.tickets.id, ticket.ticket.id))
      .returning();

    return { valid: true, ticket: updated };
  });
}
