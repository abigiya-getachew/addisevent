import { eq, and, desc, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../../db/index.js";
import { generateIdempotencyKey } from "../../utils/idempotency.js";
import { generateTicketsForBooking } from "../tickets/tickets.service.js";
import type {
  CreateBookingInput,
  ListBookingsInput,
} from "./booking.validator.js";

// ─── List ─────────────────────────────────────────────────────────────────────

export async function listUserBookings(
  userId: string,
  input: ListBookingsInput
) {
  const { page, limit, status, eventId } = input;
  const offset = (page - 1) * limit;

  const conditions = [eq(schema.bookings.userId, userId)];
  if (status) conditions.push(eq(schema.bookings.status, status));
  if (eventId) conditions.push(eq(schema.bookings.eventId, eventId));

  const [rows, [countRow]] = await Promise.all([
    db
      .select()
      .from(schema.bookings)
      .where(and(...conditions))
      .orderBy(desc(schema.bookings.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.bookings)
      .where(and(...conditions)),
  ]);

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: countRow?.count ?? 0,
      pages: Math.ceil((countRow?.count ?? 0) / limit),
    },
  };
}

// ─── Get by ID ────────────────────────────────────────────────────────────────

export async function getBookingById(id: string, userId?: string) {
  const conditions = [eq(schema.bookings.id, id)];
  if (userId) conditions.push(eq(schema.bookings.userId, userId));

  const [booking] = await db
    .select()
    .from(schema.bookings)
    .where(and(...conditions))
    .limit(1);

  if (!booking) {
    throw new HTTPException(404, { message: "Booking not found" });
  }

  const tickets = await db
    .select()
    .from(schema.tickets)
    .where(eq(schema.tickets.bookingId, id));

  return { ...booking, tickets };
}

// ─── Create (reserve) ─────────────────────────────────────────────────────────

export async function createBooking(
  input: CreateBookingInput,
  userId?: string
) {
  // Guest checkout requires phone
  if (!userId && !input.guestPhone) {
    throw new HTTPException(400, {
      message: "Phone number is required for guest checkout",
    });
  }

  // Lock the tier row and check availability atomically
  return await db.transaction(async (tx) => {
    const [tier] = await tx
      .select()
      .from(schema.ticketTiers)
      .where(
        and(
          eq(schema.ticketTiers.id, input.tierId),
          eq(schema.ticketTiers.eventId, input.eventId),
          eq(schema.ticketTiers.isActive, true)
        )
      )
      .limit(1)
      .for("update"); // Row-level lock to prevent overselling

    if (!tier) {
      throw new HTTPException(404, {
        message: "Ticket tier not found or unavailable",
      });
    }

    if (tier.availableQuantity < input.quantity) {
      throw new HTTPException(409, {
        message: `Only ${tier.availableQuantity} tickets remaining`,
      });
    }

    const unitPrice = tier.price;
    const totalAmount = (
      parseFloat(unitPrice) * input.quantity
    ).toFixed(2);

    const idempotencyKey = generateIdempotencyKey();

    // Reserve seats — decrement available quantity
    await tx
      .update(schema.ticketTiers)
      .set({
        availableQuantity: tier.availableQuantity - input.quantity,
      })
      .where(eq(schema.ticketTiers.id, tier.id));

    // Create booking in "reserved" state
    const reservedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const [booking] = await tx
      .insert(schema.bookings)
      .values({
        userId: userId ?? null,
        guestPhone: input.guestPhone ?? null,
        guestName: input.guestName ?? null,
        eventId: input.eventId,
        tierId: input.tierId,
        quantity: input.quantity,
        unitPrice,
        totalAmount,
        currency: tier.currency,
        paymentMethod: input.paymentMethod,
        status: "reserved",
        idempotencyKey,
        reservedUntil,
      })
      .returning();

    if (!booking) {
      throw new HTTPException(500, { message: "Failed to create booking" });
    }

    return booking;
  });
}

// ─── Confirm (after payment success) ─────────────────────────────────────────

export async function confirmBooking(bookingId: string) {
  return await db.transaction(async (tx) => {
    const [booking] = await tx
      .select()
      .from(schema.bookings)
      .where(eq(schema.bookings.id, bookingId))
      .limit(1)
      .for("update");

    if (!booking) {
      throw new HTTPException(404, { message: "Booking not found" });
    }

    // Idempotent — already confirmed
    if (booking.status === "paid") {
      return booking;
    }

    if (booking.status !== "reserved" && booking.status !== "pending") {
      throw new HTTPException(409, {
        message: `Cannot confirm booking in status: ${booking.status}`,
      });
    }

    const [updated] = await tx
      .update(schema.bookings)
      .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
      .where(eq(schema.bookings.id, bookingId))
      .returning();

    if (!updated) {
      throw new HTTPException(500, { message: "Failed to confirm booking" });
    }

    // Generate QR tickets
    await generateTicketsForBooking(tx, updated);

    return updated;
  });
}

// ─── Expire stale reservations (called by queue worker) ──────────────────────

export async function expireStaleBookings() {
  const now = new Date();

  const expired = await db
    .update(schema.bookings)
    .set({ status: "expired", updatedAt: new Date() })
    .where(
      and(
        eq(schema.bookings.status, "reserved"),
        sql`${schema.bookings.reservedUntil} < ${now}`
      )
    )
    .returning({ id: schema.bookings.id, tierId: schema.bookings.tierId, quantity: schema.bookings.quantity });

  // Return seats to available pool
  for (const b of expired) {
    await db
      .update(schema.ticketTiers)
      .set({
        availableQuantity: sql`${schema.ticketTiers.availableQuantity} + ${b.quantity}`,
      })
      .where(eq(schema.ticketTiers.id, b.tierId));
  }

  return expired.length;
}
