"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { and, eq, gte, isNull, lte, or } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { HTTPException } from "hono/http-exception";
import { auth, signOut } from "@/auth";
import { db } from "@/lib/db";
import {
  initiateCbeBirrPayment,
} from "@/server/src/modules/payments/cbebirr.service";
import {
  initiateTelebirrPayment,
} from "@/server/src/modules/payments/telebirr.service";
import {
  bookings,
  eventReviews,
  events,
  payments,
  savedEvents,
  ticketTiers,
  tickets,
  users,
} from "@/server/src/db/schema";

const INTEREST_OPTIONS = new Set([
  "Live music",
  "Festivals",
  "Workshops",
  "Community",
  "Arts & culture",
  "Food & drink",
  "Outdoors",
  "Nightlife",
]);

function localeFrom(formData: FormData) {
  return formData.get("locale") === "am" ? "am" : "en";
}

async function requireAttendee() {
  const session = await auth();
  const user = session?.user;
  if (!user?.id || user.role !== "attendee") {
    throw new Error("You must be signed in as an attendee to do that.");
  }
  return user;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

export async function saveEvent(eventId: string) {
  const user = await requireAttendee();
  if (!isUuid(eventId)) throw new Error("Invalid event.");

  await db
    .insert(savedEvents)
    .values({ userId: user.id, eventId })
    .onConflictDoNothing();
  revalidatePath("/[locale]/dashboard/user/saved", "page");
  revalidatePath("/[locale]/dashboard/user", "page");
}

export async function removeSavedEvent(eventId: string) {
  const user = await requireAttendee();
  if (!isUuid(eventId)) throw new Error("Invalid event.");

  await db
    .delete(savedEvents)
    .where(and(eq(savedEvents.userId, user.id), eq(savedEvents.eventId, eventId)));
  revalidatePath("/[locale]/dashboard/user/saved", "page");
  revalidatePath("/[locale]/dashboard/user", "page");
}

export async function startSavedEventBooking(eventId: string, locale: string) {
  const user = await requireAttendee();
  if (!isUuid(eventId)) throw new Error("Invalid event.");
  const now = new Date();
  const booking = await db.transaction(async (tx) => {
    const [tier] = await tx
      .select({
        id: ticketTiers.id,
        price: ticketTiers.price,
        currency: ticketTiers.currency,
        availableQuantity: ticketTiers.availableQuantity,
      })
      .from(ticketTiers)
      .innerJoin(events, eq(ticketTiers.eventId, events.id))
      .where(
        and(
          eq(events.id, eventId),
          eq(events.status, "published"),
          gte(events.startAt, now),
          eq(ticketTiers.isActive, true),
          gte(ticketTiers.availableQuantity, 1),
          or(isNull(ticketTiers.saleStartAt), lte(ticketTiers.saleStartAt, now)),
          or(isNull(ticketTiers.saleEndAt), gte(ticketTiers.saleEndAt, now)),
        ),
      )
      .orderBy(ticketTiers.price)
      .limit(1)
      .for("update");
    if (!tier) throw new Error("No tickets are currently available for this event.");

    await tx
      .update(ticketTiers)
      .set({ availableQuantity: tier.availableQuantity - 1 })
      .where(eq(ticketTiers.id, tier.id));

    const [created] = await tx
      .insert(bookings)
      .values({
        userId: user.id,
        eventId,
        tierId: tier.id,
        quantity: 1,
        unitPrice: tier.price,
        totalAmount: Number(tier.price).toFixed(2),
        currency: tier.currency,
        paymentMethod: "telebirr",
        status: "reserved",
        idempotencyKey: randomUUID(),
        reservedUntil: new Date(Date.now() + 15 * 60 * 1000),
      })
      .returning();
    if (!created) throw new Error("Failed to reserve the selected ticket.");
    return created;
  });
  redirect(`/${locale === "am" ? "am" : "en"}/checkout/${booking.id}`);
}

export async function initiateAttendeePayment(
  _previous: { error?: string; paymentUrl?: string },
  formData: FormData,
) {
  const user = await requireAttendee();
  const bookingId = String(formData.get("bookingId") ?? "");
  const gateway = String(formData.get("gateway") ?? "");
  if (!isUuid(bookingId)) return { error: "Invalid booking." };
  if (gateway !== "telebirr" && gateway !== "cbebirr") {
    return { error: "Choose Telebirr or CBE Birr to continue." };
  }

  const [booking] = await db
    .select({
      id: bookings.id,
      eventId: bookings.eventId,
      quantity: bookings.quantity,
      totalAmount: bookings.totalAmount,
      currency: bookings.currency,
      status: bookings.status,
      userId: bookings.userId,
      reservedUntil: bookings.reservedUntil,
    })
    .from(bookings)
    .where(eq(bookings.id, bookingId))
    .limit(1);
  if (!booking || booking.userId !== user.id) return { error: "Booking not found." };
  if (booking.status !== "reserved" && booking.status !== "pending") {
    return { error: "This booking can no longer be paid." };
  }
  if (booking.reservedUntil && booking.reservedUntil <= new Date()) {
    return { error: "This booking reservation has expired. Please book again." };
  }

  const [event] = await db
    .select({ title: events.title })
    .from(events)
    .where(eq(events.id, booking.eventId))
    .limit(1);
  const subject = `${event?.title ?? "Event"} — ${booking.quantity} ticket(s)`;

  try {
    let referenceId: string;
    let providerPaymentUrl: string;
    if (gateway === "telebirr") {
      const result = await initiateTelebirrPayment({
        bookingId,
        amount: String(booking.totalAmount),
        currency: booking.currency,
        subject,
      });
      referenceId = result.outTradeNo;
      providerPaymentUrl = result.paymentUrl;
    } else {
      const result = await initiateCbeBirrPayment({
        bookingId,
        amount: String(booking.totalAmount),
        currency: booking.currency,
        description: subject,
      });
      referenceId = result.referenceId;
      providerPaymentUrl = result.paymentUrl;
    }
    const paymentUrl = new URL(providerPaymentUrl);
    if (paymentUrl.protocol !== "https:") {
      throw new Error("Payment provider returned an insecure URL.");
    }

    await db.insert(payments).values({
      bookingId,
      gateway,
      gatewayRequestId: referenceId,
      amount: String(booking.totalAmount),
      currency: booking.currency,
      status: "pending",
      idempotencyKey: referenceId,
    });
    await db
      .update(bookings)
      .set({ paymentMethod: gateway, updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));
    return { paymentUrl: paymentUrl.toString() };
  } catch (error) {
    if (error instanceof HTTPException) return { error: error.message };
    throw error;
  }
}

export async function completeFreeBooking(formData: FormData) {
  const user = await requireAttendee();
  const locale = localeFrom(formData);
  const bookingId = String(formData.get("bookingId") ?? "");
  if (!isUuid(bookingId)) throw new Error("Invalid booking.");
  await db.transaction(async (tx) => {
    const [booking] = await tx
      .select()
      .from(bookings)
      .where(eq(bookings.id, bookingId))
      .limit(1)
      .for("update");
    if (!booking || booking.userId !== user.id) {
      throw new Error("Booking not found.");
    }
    if (Number(booking.totalAmount) !== 0) {
      throw new Error("This booking requires payment.");
    }
    if (booking.status !== "reserved" && booking.status !== "pending") {
      throw new Error("This booking can no longer be confirmed.");
    }
    if (booking.reservedUntil && booking.reservedUntil <= new Date()) {
      throw new Error("This booking reservation has expired. Please book again.");
    }

    await tx
      .update(bookings)
      .set({ status: "paid", paidAt: new Date(), updatedAt: new Date() })
      .where(eq(bookings.id, bookingId));
    await tx.insert(tickets).values(
      Array.from({ length: booking.quantity }, () => ({
        bookingId,
        status: "issued" as const,
      })),
    );
  });
  redirect(`/${locale}/dashboard/user/tickets`);
}

export async function submitEventReview(
  _previous: { error?: string; success?: string },
  formData: FormData,
) {
  const user = await requireAttendee();
  const eventId = String(formData.get("eventId") ?? "");
  const rating = Number(formData.get("rating"));
  const review = String(formData.get("review") ?? "").trim();
  if (!isUuid(eventId)) return { error: "Invalid event." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { error: "Choose a rating from 1 to 5." };
  }
  if (review.length > 2000) return { error: "Review must be 2,000 characters or fewer." };

  const [eligible] = await db
    .select({ id: tickets.id })
    .from(tickets)
    .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
    .where(
      and(
        eq(bookings.userId, user.id),
        eq(bookings.eventId, eventId),
        eq(bookings.status, "paid"),
        eq(tickets.status, "scanned"),
      ),
    )
    .limit(1);
  if (!eligible) {
    return { error: "You can review an event after your ticket is checked in." };
  }

  await db
    .insert(eventReviews)
    .values({
      userId: user.id,
      eventId,
      rating,
      review: review || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: [eventReviews.userId, eventReviews.eventId],
      set: { rating, review: review || null, updatedAt: new Date() },
    });

  revalidatePath("/[locale]/dashboard/past", "page");
  return { success: "Your review has been saved." };
}

export async function updateAttendeeProfile(
  _previous: { error?: string; success?: string },
  formData: FormData,
) {
  const user = await requireAttendee();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const avatarUrl = String(formData.get("avatarUrl") ?? "").trim();
  const interests = formData
    .getAll("interests")
    .map(String)
    .filter((value) => INTEREST_OPTIONS.has(value));

  if (!name || name.length > 255) {
    return { error: "Enter a name under 255 characters." };
  }
  if (phone && (phone.length < 9 || phone.length > 20)) {
    return { error: "Enter a phone number between 9 and 20 characters." };
  }
  if (avatarUrl) {
    let parsed: URL;
    try {
      parsed = new URL(avatarUrl);
    } catch (error) {
      if (error instanceof TypeError) return { error: "Enter a valid profile photo URL." };
      throw error;
    }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { error: "Profile photo URL must use HTTP or HTTPS." };
    }
  }

  await db
    .update(users)
    .set({
      name,
      phone: phone || null,
      avatarUrl: avatarUrl || null,
      interests,
      emailNotifications: formData.get("emailNotifications") === "on",
      smsReminders: formData.get("smsReminders") === "on",
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  revalidatePath("/[locale]/dashboard/profile", "page");
  revalidatePath("/[locale]/dashboard/user", "page");
  return { success: "Profile saved." };
}

export async function changeAttendeePassword(
  _previous: { error?: string; success?: string },
  formData: FormData,
) {
  const user = await requireAttendee();
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (newPassword.length < 8 || newPassword.length > 128) {
    return { error: "New password must be between 8 and 128 characters." };
  }
  if (newPassword !== confirmPassword) return { error: "New passwords do not match." };

  const [account] = await db
    .select({ passwordHash: users.passwordHash })
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);
  if (!account?.passwordHash) {
    return { error: "This account uses social sign-in and does not have a password." };
  }
  if (!(await bcrypt.compare(currentPassword, account.passwordHash))) {
    return { error: "Current password is incorrect." };
  }

  const passwordHash = await bcrypt.hash(newPassword, 12);
  await db
    .update(users)
    .set({ passwordHash, updatedAt: new Date() })
    .where(eq(users.id, user.id));

  revalidatePath("/[locale]/dashboard/profile", "page");
  return { success: "Password changed successfully." };
}

export async function deleteAttendeeAccount(formData: FormData) {
  const user = await requireAttendee();
  const locale = localeFrom(formData);
  const confirmation = String(formData.get("confirmation") ?? "");
  if (confirmation !== "DELETE") throw new Error("Type DELETE to confirm account deletion.");

  await db.transaction(async (tx) => {
    await tx
      .update(bookings)
      .set({
        userId: null,
        guestPhone: null,
        guestName: null,
        updatedAt: new Date(),
      })
      .where(eq(bookings.userId, user.id));
    await tx.delete(users).where(eq(users.id, user.id));
  });

  await signOut({ redirectTo: `/${locale}/auth/login?accountDeleted=1` });
  redirect(`/${locale}/auth/login?accountDeleted=1`);
}
