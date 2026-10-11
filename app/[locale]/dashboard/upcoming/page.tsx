import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { and, asc, eq, gte } from "drizzle-orm";
import { auth } from "@/auth";
import { UpcomingEventCard } from "@/components/dashboard/UpcomingEventCard";
import { UserDashboardNavigation } from "@/components/dashboard/UserDashboardNavigation";
import { db } from "@/lib/db";
import { bookings, events, tickets } from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "Upcoming Events | AddisEvent",
};

export default async function UpcomingEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user?.id) redirect(`/${locale}/auth/login`);
  if (user.role === "organizer") redirect(`/${locale}/organizer`);
  if (user.role === "admin") redirect(`/${locale}/admin`);

  const now = new Date();
  const bookedEvents = await db
    .select({
      id: events.id,
      ticketId: tickets.id,
      title: events.title,
      imageUrl: events.imageUrl,
      startAt: events.startAt,
      endAt: events.endAt,
      venue: events.venue,
      venueAddress: events.venueAddress,
      city: events.city,
    })
    .from(bookings)
    .innerJoin(events, eq(bookings.eventId, events.id))
    .leftJoin(tickets, eq(tickets.bookingId, bookings.id))
    .where(
      and(
        eq(bookings.userId, user.id),
        eq(bookings.status, "paid"),
        gte(events.startAt, now),
      ),
    )
    .orderBy(asc(events.startAt), asc(tickets.issuedAt));

  const uniqueEvents = new Map<
    string,
    (typeof bookedEvents)[number]
  >();
  for (const event of bookedEvents) {
    if (!uniqueEvents.has(event.id)) uniqueEvents.set(event.id, event);
  }
  const upcomingEvents = Array.from(uniqueEvents.values());

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
            <p className="text-sm font-semibold text-brand-red">Your plans</p>
            <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
              Upcoming events
            </h1>
            <p className="mt-2 text-sm text-text-secondary">
              Your booked events, sorted by the next one coming up.
            </p>
          </header>

          {upcomingEvents.length > 0 ? (
            <div className="space-y-5">
              {upcomingEvents.map((event) => (
                <UpcomingEventCard
                  key={event.id}
                  locale={locale}
                  event={{
                    id: event.id,
                    ticketId: event.ticketId,
                    title: event.title,
                    imageUrl: event.imageUrl,
                    startAt: event.startAt.toISOString(),
                    endAt: event.endAt?.toISOString() ?? null,
                    venue: event.venue,
                    venueAddress: event.venueAddress,
                    city: event.city,
                  }}
                />
              ))}
            </div>
          ) : (
            <section className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
              <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-secondary-soft text-brand-deep-blue">
                <CalendarDays aria-hidden="true" className="size-6" />
              </span>
              <h2 className="mt-5 font-heading text-xl font-semibold text-charcoal">
                No upcoming events
              </h2>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
                Events you’ve booked that haven’t started yet will show up here.
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
