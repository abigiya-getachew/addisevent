import { eq, and, gte, lte, desc, sql } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import { db, schema } from "../../db/index.js";
import type {
  CreateEventInput,
  UpdateEventInput,
  ListEventsInput,
} from "./events.validator.js";

// ─── List ─────────────────────────────────────────────────────────────────────

export async function listEvents(input: ListEventsInput) {
  const { page, limit, category, city, status, from, to, organizerId } = input;
  const offset = (page - 1) * limit;

  const conditions = [eq(schema.events.status, status!)];

  if (category) conditions.push(eq(schema.events.category, category));
  if (city) conditions.push(eq(schema.events.city, city));
  if (organizerId) conditions.push(eq(schema.events.organizerId, organizerId));
  if (from) conditions.push(gte(schema.events.startAt, new Date(from)));
  if (to) conditions.push(lte(schema.events.startAt, new Date(to)));

  const [rows, [countRow]] = await Promise.all([
    db
      .select()
      .from(schema.events)
      .where(and(...conditions))
      .orderBy(desc(schema.events.startAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(schema.events)
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

export async function getEventById(id: string) {
  const [event] = await db
    .select()
    .from(schema.events)
    .where(eq(schema.events.id, id))
    .limit(1);

  if (!event) {
    throw new HTTPException(404, { message: "Event not found" });
  }

  const tiers = await db
    .select()
    .from(schema.ticketTiers)
    .where(
      and(
        eq(schema.ticketTiers.eventId, id),
        eq(schema.ticketTiers.isActive, true)
      )
    );

  return { ...event, tiers };
}

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createEvent(
  organizerId: string,
  input: CreateEventInput
) {
  const { tiers, ...eventData } = input;

  const [event] = await db
    .insert(schema.events)
    .values({
      ...eventData,
      organizerId,
      startAt: new Date(eventData.startAt),
      endAt: eventData.endAt ? new Date(eventData.endAt) : null,
      availableCapacity: eventData.totalCapacity,
    })
    .returning();

  if (!event) {
    throw new HTTPException(500, { message: "Failed to create event" });
  }

  // Insert tiers
  await db.insert(schema.ticketTiers).values(
    tiers.map((tier) => ({
      ...tier,
      eventId: event.id,
      availableQuantity: tier.totalQuantity,
      saleStartAt: tier.saleStartAt ? new Date(tier.saleStartAt) : null,
      saleEndAt: tier.saleEndAt ? new Date(tier.saleEndAt) : null,
    }))
  );

  return getEventById(event.id);
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateEvent(
  id: string,
  organizerId: string,
  input: UpdateEventInput
) {
  const [event] = await db
    .select({ id: schema.events.id, organizerId: schema.events.organizerId })
    .from(schema.events)
    .where(eq(schema.events.id, id))
    .limit(1);

  if (!event) {
    throw new HTTPException(404, { message: "Event not found" });
  }

  if (event.organizerId !== organizerId) {
    throw new HTTPException(403, {
      message: "You are not the organizer of this event",
    });
  }

  const updateData: Record<string, unknown> = {
    ...input,
    updatedAt: new Date(),
  };

  if (input.startAt) updateData.startAt = new Date(input.startAt);
  if (input.endAt) updateData.endAt = new Date(input.endAt);

  const [updated] = await db
    .update(schema.events)
    .set(updateData)
    .where(eq(schema.events.id, id))
    .returning();

  return updated;
}

// ─── Publish / Cancel ─────────────────────────────────────────────────────────

export async function publishEvent(id: string, organizerId: string) {
  return updateEvent(id, organizerId, { status: "published" });
}

export async function cancelEvent(id: string, organizerId: string) {
  return updateEvent(id, organizerId, { status: "cancelled" });
}

// ─── Delete (draft only) ──────────────────────────────────────────────────────

export async function deleteEvent(id: string, organizerId: string) {
  const [event] = await db
    .select({ id: schema.events.id, organizerId: schema.events.organizerId, status: schema.events.status })
    .from(schema.events)
    .where(eq(schema.events.id, id))
    .limit(1);

  if (!event) throw new HTTPException(404, { message: "Event not found" });
  if (event.organizerId !== organizerId) {
    throw new HTTPException(403, { message: "Not authorized" });
  }
  if (event.status !== "draft") {
    throw new HTTPException(400, {
      message: "Only draft events can be deleted",
    });
  }

  await db.delete(schema.events).where(eq(schema.events.id, id));
}
