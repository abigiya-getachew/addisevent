import { db } from '../../db/index.js';
import { events } from '../../db/schema.js';
type Event = typeof events.$inferSelect;
import { eq, and, desc } from 'drizzle-orm';
import type { CreateEventInput } from './events.schema.js';

// Get all PUBLISHED events — for homepage & events page
export async function getPublishedEvents() {
  return await db.query.events.findMany({
    where: eq(events.status, 'published'),
    orderBy: [desc(events.startAt)],
    with: { organizer: { columns: { id: true, name: true, phone: true } } },
  });
}

// Get events created by ONE organizer
export async function getOrganizerEvents(organizerId: string) {
  return await db.query.events.findMany({
    where: eq(events.organizerId, organizerId),
    orderBy: [desc(events.createdAt)],
    with: { ticketTiers: true },
  });
}

// Get single event by ID — public view
export async function getEventById(eventId: string) {
  return await db.query.events.findFirst({
    where: eq(events.id, eventId),
    with: {
      organizer: { columns: { id: true, name: true, phone: true } },
      ticketTiers: { where: (tiers, { eq }) => eq(tiers.isActive, true) },
    },
  });
}

// Create new event — organizer only
export async function createEvent(
  organizerId: string,
  data: CreateEventInput
): Promise<Event> {
  const [newEvent] = await db.insert(events)
    .values({
      organizerId,
      ...data,
      availableCapacity: data.totalCapacity,
    })
    .returning();

  return newEvent;
}

// Update event — organizer only
export async function updateEvent(
  eventId: string,
  organizerId: string,
  data: Partial<CreateEventInput>
) {
  const [updated] = await db.update(events)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(events.id, eventId), eq(events.organizerId, organizerId)))
    .returning();

  return updated;
}