"use server";

import { and, eq, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  bookings,
  events,
  organizerPayoutAccounts,
  ticketTiers,
  tickets,
  users,
} from "@/server/src/db/schema";

const tierSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(100),
  nameAm: z.string().trim().max(100).optional(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/),
  totalQuantity: z.number().int().positive(),
  maxPerBooking: z.number().int().min(1).max(100),
  saleStartAt: z.string().datetime().optional(),
  saleEndAt: z.string().datetime().optional(),
});

const eventSchema = z.object({
  title: z.string().trim().min(3).max(255),
  titleAm: z.string().trim().max(255).optional(),
  category: z.enum([
    "Music",
    "Festival",
    "Workshop",
    "Community",
    "Sports",
    "Other",
  ]),
  description: z.string().optional(),
  descriptionAm: z.string().optional(),
  venue: z.string().trim().max(255).optional(),
  venueAddress: z.string().trim().optional(),
  city: z.string().trim().min(1).max(100),
  startAt: z.string().datetime(),
  endAt: z.string().datetime().optional(),
  imageUrl: z.union([z.literal(""), z.string().url()]).optional(),
  tiers: z.array(tierSchema).min(1),
  status: z.enum(["draft", "published"]),
});

const payoutSchema = z.object({
  method: z.enum(["telebirr", "cbebirr", "bank_transfer"]),
  accountHolderName: z.string().trim().min(2).max(255),
  accountNumber: z.string().trim().min(4).max(255),
});

async function requireOrganizer() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "organizer") {
    throw new Error("You must be signed in as an organizer to do that.");
  }
  return session.user;
}

function formText(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function localDateToIso(value: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

function parseEventForm(formData: FormData) {
  let tiers: unknown;
  try {
    tiers = JSON.parse(formText(formData, "tiers"));
  } catch {
    return { error: "Ticket tier data is invalid." } as const;
  }

  const startAt = localDateToIso(formText(formData, "startAt"));
  const endAt = localDateToIso(formText(formData, "endAt"));
  if (!startAt) return { error: "Choose a valid event start date and time." } as const;
  if (formText(formData, "endAt") && !endAt) {
    return { error: "Choose a valid event end date and time." } as const;
  }

  const parsed = eventSchema.safeParse({
    title: formText(formData, "title"),
    titleAm: formText(formData, "titleAm") || undefined,
    category: formText(formData, "category"),
    description: formText(formData, "description") || undefined,
    descriptionAm: formText(formData, "descriptionAm") || undefined,
    venue: formText(formData, "venue") || undefined,
    venueAddress: formText(formData, "venueAddress") || undefined,
    city: formText(formData, "city") || "Addis Ababa",
    startAt,
    endAt,
    imageUrl: formText(formData, "imageUrl") || undefined,
    tiers,
    status: formText(formData, "intent") === "publish" ? "published" : "draft",
  });
  if (!parsed.success) {
    return {
      error: parsed.error.issues[0]?.message ?? "Check the event details and try again.",
    } as const;
  }

  return { data: parsed.data } as const;
}

function tierValues(
  tier: z.infer<typeof tierSchema>,
  eventId: string,
  availableQuantity = tier.totalQuantity,
) {
  return {
    eventId,
    name: tier.name,
    nameAm: tier.nameAm || null,
    price: tier.price,
    currency: "ETB",
    totalQuantity: tier.totalQuantity,
    availableQuantity,
    maxPerBooking: tier.maxPerBooking,
    saleStartAt: tier.saleStartAt ? new Date(tier.saleStartAt) : null,
    saleEndAt: tier.saleEndAt ? new Date(tier.saleEndAt) : null,
    isActive: true,
  };
}

export async function saveOrganizerEvent(
  _previous: { error?: string },
  formData: FormData,
) {
  const user = await requireOrganizer();
  const parsed = parseEventForm(formData);
  if ("error" in parsed) return parsed;

  const id = formText(formData, "eventId");
  const { tiers, status, ...details } = parsed.data;
  const totalCapacity = tiers.reduce((sum, tier) => sum + tier.totalQuantity, 0);
  const eventValues = {
    ...details,
    startAt: new Date(details.startAt),
    endAt: details.endAt ? new Date(details.endAt) : null,
    titleAm: details.titleAm || null,
    description: details.description || null,
    descriptionAm: details.descriptionAm || null,
    venue: details.venue || null,
    venueAddress: details.venueAddress || null,
    imageUrl: details.imageUrl || null,
    totalCapacity,
    isFree: tiers.every((tier) => Number(tier.price) === 0),
    status,
    updatedAt: new Date(),
  };

  try {
    if (!id) {
      const eventId = await db.transaction(async (tx) => {
        const [event] = await tx
          .insert(events)
          .values({
            ...eventValues,
            organizerId: user.id,
            availableCapacity: totalCapacity,
          })
          .returning({ id: events.id });
        if (!event) throw new Error("The event could not be created.");

        await tx.insert(ticketTiers).values(
          tiers.map((tier) => tierValues(tier, event.id)),
        );
        return event.id;
      });
      revalidatePath("/[locale]/organizer", "page");
      revalidatePath("/[locale]/organizer/events", "page");
      redirect(`/en/organizer/events/${eventId}`);
    }

    const savedId = await db.transaction(async (tx) => {
      const [existingEvent] = await tx
        .select({ id: events.id })
        .from(events)
        .where(and(eq(events.id, id), eq(events.organizerId, user.id)))
        .limit(1);
      if (!existingEvent) throw new Error("Event not found.");

      const currentTiers = await tx
        .select()
        .from(ticketTiers)
        .where(eq(ticketTiers.eventId, id));
      const currentById = new Map(currentTiers.map((tier) => [tier.id, tier]));
      const submittedIds = tiers.flatMap((tier) => (tier.id ? [tier.id] : []));

      for (const tier of tiers) {
        if (!tier.id) continue;
        const current = currentById.get(tier.id);
        if (!current) throw new Error("A ticket tier does not belong to this event.");

        const committedQuantity = current.totalQuantity - current.availableQuantity;
        if (tier.totalQuantity < committedQuantity) {
          throw new Error(
            `The quantity for ${current.name} cannot be less than tickets already reserved or sold.`,
          );
        }
        await tx
          .update(ticketTiers)
          .set(tierValues(tier, id, tier.totalQuantity - committedQuantity))
          .where(eq(ticketTiers.id, tier.id));
      }

      for (const tier of tiers) {
        if (tier.id) continue;
        await tx.insert(ticketTiers).values(tierValues(tier, id));
      }

      const removedIds = currentTiers
        .filter((tier) => !submittedIds.includes(tier.id))
        .map((tier) => tier.id);
      if (removedIds.length > 0) {
        await tx
          .update(ticketTiers)
          .set({ isActive: false })
          .where(inArray(ticketTiers.id, removedIds));
      }

      await tx.update(events).set(eventValues).where(eq(events.id, id));
      return id;
    });

    revalidatePath("/[locale]/organizer", "page");
    revalidatePath("/[locale]/organizer/events", "page");
    revalidatePath(`/[locale]/organizer/events/${savedId}`, "page");
    redirect(`/en/organizer/events/${savedId}`);
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    console.error("Failed to save organizer event:", error);
    return {
      error: error instanceof Error
        ? error.message
        : "The event could not be saved. Please try again.",
    };
  }
}

export async function cancelOrganizerEvent(formData: FormData) {
  const user = await requireOrganizer();
  const eventId = formText(formData, "eventId");
  const [event] = await db
    .select({ id: events.id, status: events.status })
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.organizerId, user.id)))
    .limit(1);
  if (!event) throw new Error("Event not found.");
  if (event.status !== "published" && event.status !== "draft") {
    throw new Error("Only draft or published events can be cancelled.");
  }
  await db
    .update(events)
    .set({ status: "cancelled", updatedAt: new Date() })
    .where(eq(events.id, eventId));
  revalidatePath("/[locale]/organizer/events", "page");
  revalidatePath(`/[locale]/organizer/events/${eventId}`, "page");
  redirect(`/en/organizer/events/${eventId}?cancelled=1`);
}

export async function deleteOrganizerDraft(formData: FormData) {
  const user = await requireOrganizer();
  const eventId = formText(formData, "eventId");
  const [event] = await db
    .select({ id: events.id, status: events.status })
    .from(events)
    .where(and(eq(events.id, eventId), eq(events.organizerId, user.id)))
    .limit(1);
  if (!event) throw new Error("Event not found.");
  if (event.status !== "draft") {
    throw new Error("Only draft events can be deleted.");
  }
  await db.delete(events).where(eq(events.id, eventId));
  revalidatePath("/[locale]/organizer/events", "page");
  redirect("/en/organizer/events");
}

export async function duplicateOrganizerEvent(formData: FormData) {
  const user = await requireOrganizer();
  const eventId = formText(formData, "eventId");
  const newEventId = await db.transaction(async (tx) => {
    const [source] = await tx
      .select()
      .from(events)
      .where(and(eq(events.id, eventId), eq(events.organizerId, user.id)))
      .limit(1);
    if (!source) throw new Error("Event not found.");

    const [copy] = await tx
      .insert(events)
      .values({
        organizerId: user.id,
        title: `${source.title} (Copy)`,
        titleAm: source.titleAm,
        description: source.description,
        descriptionAm: source.descriptionAm,
        category: source.category,
        venue: source.venue,
        venueAddress: source.venueAddress,
        city: source.city,
        startAt: source.startAt,
        endAt: source.endAt,
        imageUrl: source.imageUrl,
        totalCapacity: source.totalCapacity,
        availableCapacity: source.totalCapacity,
        isFree: source.isFree,
        status: "draft",
        tags: source.tags,
        metadata: source.metadata,
      })
      .returning({ id: events.id });
    if (!copy) throw new Error("The event could not be duplicated.");

    const sourceTiers = await tx
      .select()
      .from(ticketTiers)
      .where(and(eq(ticketTiers.eventId, eventId), eq(ticketTiers.isActive, true)));
    if (sourceTiers.length > 0) {
      await tx.insert(ticketTiers).values(
        sourceTiers.map((tier) => ({
          eventId: copy.id,
          name: tier.name,
          nameAm: tier.nameAm,
          price: tier.price,
          currency: tier.currency,
          totalQuantity: tier.totalQuantity,
          availableQuantity: tier.totalQuantity,
          maxPerBooking: tier.maxPerBooking,
          saleStartAt: tier.saleStartAt,
          saleEndAt: tier.saleEndAt,
        })),
      );
    }
    return copy.id;
  });

  revalidatePath("/[locale]/organizer/events", "page");
  redirect(`/en/organizer/events/${newEventId}/edit`);
}

export async function markOrganizerTicketCheckedIn(formData: FormData) {
  const user = await requireOrganizer();
  const eventId = formText(formData, "eventId");
  const ticketId = formText(formData, "ticketId");
  const [ticket] = await db
    .select({ id: tickets.id, status: tickets.status })
    .from(tickets)
    .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
    .innerJoin(events, eq(bookings.eventId, events.id))
    .where(
      and(
        eq(tickets.id, ticketId),
        eq(events.id, eventId),
        eq(events.organizerId, user.id),
      ),
    )
    .limit(1);
  if (!ticket) throw new Error("Ticket not found.");
  if (ticket.status !== "issued") throw new Error("This ticket is already checked in or unavailable.");
  await db
    .update(tickets)
    .set({ status: "scanned", scannedAt: new Date(), scannedBy: user.id })
    .where(eq(tickets.id, ticketId));
  revalidatePath(`/[locale]/organizer/events/${eventId}`, "page");
  redirect(`/en/organizer/events/${eventId}?tab=attendees`);
}

export async function saveOrganizerAccountSettings(
  _previous: { error?: string; success?: string },
  formData: FormData,
) {
  const user = await requireOrganizer();
  const name = formText(formData, "name");
  const phone = formText(formData, "phone");
  const locale = formText(formData, "locale");

  const parsed = z.object({
    name: z.string().trim().min(2).max(255),
    phone: z.string().trim().max(20).optional(),
    locale: z.enum(["en", "am"]),
  }).safeParse({ name, phone: phone || undefined, locale });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your account details." };
  }

  try {
    await db
      .update(users)
      .set({ name: parsed.data.name, phone: parsed.data.phone ?? null, locale: parsed.data.locale, updatedAt: new Date() })
      .where(eq(users.id, user.id));
    revalidatePath("/[locale]/organizer/settings", "page");
    return { success: "Account settings saved." };
  } catch (error) {
    console.error("Failed to save account settings:", error);
    return { error: "Could not save account settings. Please try again." };
  }
}

export async function saveOrganizerPayoutAccount(
  _previous: { error?: string; success?: string },
  formData: FormData,
) {
  const user = await requireOrganizer();
  const parsed = payoutSchema.safeParse({
    method: formText(formData, "method"),
    accountHolderName: formText(formData, "accountHolderName"),
    accountNumber: formText(formData, "accountNumber"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your payout account details." };
  }

  try {
    await db
      .insert(organizerPayoutAccounts)
      .values({
        userId: user.id,
        ...parsed.data,
        isVerified: false,
        updatedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: organizerPayoutAccounts.userId,
        set: {
          ...parsed.data,
          isVerified: false,
          updatedAt: new Date(),
        },
      });
    revalidatePath("/[locale]/organizer/settings", "page");
    return { success: "Payout account saved. Verification is pending provider confirmation." };
  } catch (error) {
    console.error("Failed to save organizer payout account:", error);
    return { error: "The payout account could not be saved. Please try again." };
  }
}
