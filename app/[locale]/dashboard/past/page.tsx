import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft, CalendarCheck2, MapPin } from "lucide-react";
import { auth } from "@/auth";
import { EventReviewForm } from "@/components/dashboard/EventReviewForm";
import { ReceiptDownloadButton } from "@/components/dashboard/ReceiptDownloadButton";
import { UserDashboardNavigation } from "@/components/dashboard/UserDashboardNavigation";
import { db } from "@/lib/db";
import {
  bookings,
  eventReviews,
  events,
  ticketTiers,
  tickets,
} from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "Past Events | AddisEvent",
};

export default async function PastEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect(`/${locale}/auth/login`);
  if (user.role === "organizer") redirect(`/${locale}/dashboard/organizer`);
  if (user.role === "admin") redirect(`/${locale}/admin`);

  const rows = await db
    .select({
      eventId: events.id,
      title: events.title,
      category: events.category,
      startAt: events.startAt,
      venue: events.venue,
      city: events.city,
      ticketId: tickets.id,
      bookingId: bookings.id,
      amount: bookings.totalAmount,
      currency: bookings.currency,
      paymentMethod: bookings.paymentMethod,
      paidAt: bookings.paidAt,
      bookedAt: bookings.createdAt,
      ticketName: ticketTiers.name,
      reviewRating: eventReviews.rating,
      reviewText: eventReviews.review,
    })
    .from(tickets)
    .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
    .innerJoin(events, eq(bookings.eventId, events.id))
    .innerJoin(ticketTiers, eq(bookings.tierId, ticketTiers.id))
    .leftJoin(
      eventReviews,
      and(
        eq(eventReviews.eventId, events.id),
        eq(eventReviews.userId, user.id),
      ),
    )
    .where(
      and(
        eq(bookings.userId, user.id),
        eq(bookings.status, "paid"),
        eq(tickets.status, "scanned"),
      ),
    )
    .orderBy(desc(events.startAt), desc(tickets.scannedAt));

  const eventMap = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    if (!eventMap.has(row.eventId)) eventMap.set(row.eventId, row);
  }
  const pastEvents = Array.from(eventMap.values());

  return (
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-[1600px]">
      <UserDashboardNavigation locale={locale} />
      <main className="min-w-0 flex-1 px-4 py-7 pb-28 sm:px-6 sm:py-10 md:pb-10">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            href={`/${locale}/dashboard/user`}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-brand-red"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Dashboard
          </Link>
          <header className="mb-8">
            <p className="text-sm font-semibold text-brand-red">The good times</p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Past events
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Events where your ticket was checked in.
            </p>
          </header>

          {pastEvents.length ? (
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <article
                  key={event.eventId}
                  className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-3 py-1 text-xs font-semibold text-success">
                        <CalendarCheck2 aria-hidden="true" className="size-3.5" />
                        Attended
                      </span>
                      <h2 className="mt-3 font-heading text-xl font-bold text-charcoal">
                        {event.title}
                      </h2>
                      <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-brand-red">
                        {event.category}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                        <span className="inline-flex items-center gap-2">
                          <CalendarCheck2 aria-hidden="true" className="size-4 text-brand-gold" />
                          {new Intl.DateTimeFormat(locale, {
                            dateStyle: "medium",
                            timeStyle: "short",
                            timeZone: "Africa/Addis_Ababa",
                          }).format(event.startAt)}
                        </span>
                        {(event.venue || event.city) && (
                          <span className="inline-flex items-center gap-2">
                            <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
                            {[event.venue, event.city].filter(Boolean).join(", ")}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs text-text-muted">
                        {event.ticketName} · Ticket {event.ticketId.slice(0, 8).toUpperCase()}
                      </p>
                    </div>
                    <ReceiptDownloadButton
                      receipt={{
                        reference: event.bookingId,
                        event: event.title,
                        amount: `${Number(event.amount).toLocaleString(locale)} ${event.currency}`,
                        date: (event.paidAt ?? event.bookedAt).toISOString(),
                        method: (event.paymentMethod ?? "not recorded").replaceAll("_", " "),
                        status: "completed",
                      }}
                    />
                  </div>
                  <div className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <h3 className="text-sm font-semibold text-charcoal">
                        Leave a review
                      </h3>
                      <EventReviewForm
                        eventId={event.eventId}
                        initialRating={event.reviewRating ?? undefined}
                        initialReview={event.reviewText}
                      />
                    </div>
                    <Link
                      href={`/${locale}/events?category=${encodeURIComponent(event.category)}`}
                      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold"
                    >
                      Find similar events
                    </Link>
                  </div>
                  <p className="mt-4 text-xs text-text-muted">
                    Event photo galleries aren’t available yet.
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <section className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-success-soft text-success">
                <CalendarCheck2 aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-5 font-heading text-xl font-semibold text-charcoal">
                Your event history starts here
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                Attended events will show up after your ticket is scanned at the venue.
              </p>
              <Link
                href={`/${locale}/events`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c93630]"
              >
                Explore events
              </Link>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
