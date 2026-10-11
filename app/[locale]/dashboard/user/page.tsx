import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Compass,
  MapPin,
  Sparkles,
  Ticket,
  Bookmark,
} from "lucide-react";
import { and, asc, desc, eq, gte, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { SaveEventButton } from "@/components/dashboard/SaveEventButton";
import { bookings, events, savedEvents, tickets } from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "My Dashboard | AddisEvent",
};

export default async function UserDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user?.id) redirect(`/${locale}/login`);
  if (user.role === "organizer") redirect(`/${locale}/dashboard/organizer`);
  if (user.role === "admin") redirect(`/${locale}/admin`);

  const now = new Date();
  const userBookings = db
    .select({
      category: events.category,
    })
    .from(bookings)
    .innerJoin(events, eq(bookings.eventId, events.id))
    .where(and(eq(bookings.userId, user.id), eq(bookings.status, "paid")))
    .groupBy(events.category)
    .orderBy(desc(sql<number>`count(*)`))
    .limit(1);

  const [activeTicketRows, attendedEventRows, nextEvents, categoryRows, recommendedEvents, savedEventRows] =
    await Promise.all([
      db
        .select({
          count: sql<number>`count(*)::int`,
        })
        .from(tickets)
        .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
        .innerJoin(events, eq(bookings.eventId, events.id))
        .where(
          and(
            eq(bookings.userId, user.id),
            eq(bookings.status, "paid"),
            eq(tickets.status, "issued"),
            gte(events.startAt, now),
          ),
        ),
      db
        .select({
          count: sql<number>`count(distinct ${events.id})::int`,
        })
        .from(tickets)
        .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
        .innerJoin(events, eq(bookings.eventId, events.id))
        .where(
          and(
            eq(bookings.userId, user.id),
            eq(bookings.status, "paid"),
            eq(tickets.status, "scanned"),
          ),
        ),
      db
        .select({
          id: events.id,
          title: events.title,
          category: events.category,
          venue: events.venue,
          startAt: events.startAt,
        })
        .from(bookings)
        .innerJoin(events, eq(bookings.eventId, events.id))
        .where(
          and(
            eq(bookings.userId, user.id),
            eq(bookings.status, "paid"),
            gte(events.startAt, now),
          ),
        )
        .orderBy(asc(events.startAt))
        .limit(5),
      userBookings,
      db
        .select({
          id: events.id,
          title: events.title,
          category: events.category,
          venue: events.venue,
          startAt: events.startAt,
          isFree: events.isFree,
        })
        .from(events)
        .where(and(eq(events.status, "published"), gte(events.startAt, now)))
        .orderBy(asc(events.startAt))
        .limit(12),
      db
        .select({ eventId: savedEvents.eventId })
        .from(savedEvents)
        .where(eq(savedEvents.userId, user.id)),
    ]);

  const nextEvent = nextEvents[0];
  const favoriteCategory = categoryRows[0]?.category;
  const savedEventIds = new Set(savedEventRows.map(({ eventId }) => eventId));
  const recommendations = recommendedEvents
    .filter((event) => !nextEvents.some((booked) => booked.id === event.id))
    .sort(
      (first, second) =>
        Number(second.category === favoriteCategory) -
        Number(first.category === favoriteCategory),
    )
    .slice(0, 3);
  const stats = {
    activeTickets: activeTicketRows[0]?.count ?? 0,
    attendedEvents: attendedEventRows[0]?.count ?? 0,
  };
  const firstName = user.name?.trim().split(/\s+/)[0] || "there";

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-7 sm:px-6 sm:py-10">
      <header className="mb-8 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-brand-red">Your dashboard</p>
          <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
            Welcome back, {firstName}!
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Your tickets, plans, and a little inspiration for what’s next.
          </p>
        </div>
        <Link
          href={`/${locale}/events`}
          className="hidden shrink-0 items-center gap-2 rounded-full bg-charcoal px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-red sm:inline-flex"
        >
          Explore events <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </header>

      <section
        aria-label="Your event summary"
        className="grid grid-cols-2 gap-3 lg:grid-cols-4"
      >
        <StatCard
          href={`/${locale}/dashboard/user/tickets`}
          label="Active tickets"
          value={stats.activeTickets}
          icon={<Ticket aria-hidden="true" className="size-5" />}
          detail="Ready when you are"
          accent="red"
        />
        <StatCard
          href={`/${locale}/dashboard/user/saved`}
          label="Saved events"
          value={savedEventRows.length}
          icon={<Bookmark aria-hidden="true" className="size-5" />}
          detail="Your shortlist"
          accent="gold"
        />
        <StatCard
          href={`/${locale}/dashboard/past`}
          label="Events attended"
          value={stats.attendedEvents}
          icon={<Check aria-hidden="true" className="size-5" />}
          detail="Memories made"
          accent="blue"
        />
        <Link
          href={`/${locale}/events`}
          className="group col-span-2 flex min-h-32 items-center justify-between rounded-2xl bg-brand-deep-blue p-5 text-white transition hover:-translate-y-0.5 hover:shadow-(--shadow-2) lg:col-span-1 lg:block"
        >
          <span>
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/15">
              <Compass aria-hidden="true" className="size-5" />
            </span>
            <span className="mt-4 block font-heading text-lg font-semibold">
              Find your next event
            </span>
            <span className="mt-1 block text-sm text-white/75">
              See what’s happening
            </span>
          </span>
          <ArrowRight
            aria-hidden="true"
            className="size-5 shrink-0 transition-transform group-hover:translate-x-1 lg:mt-4"
          />
        </Link>
      </section>

      <section id="coming-up" className="mt-10 scroll-mt-28">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-red">On your calendar</p>
            <h2 className="mt-1 font-heading text-xl font-bold text-charcoal sm:text-2xl">
              Coming up
            </h2>
          </div>
          <Link
            href={`/${locale}/dashboard/past`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-charcoal hover:text-brand-red"
          >
            My tickets <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {nextEvent ? (
          <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-(--shadow-1)">
            <div className="grid gap-0 sm:grid-cols-[1fr_auto]">
              <div className="p-5 sm:p-7">
                <span className="inline-flex items-center gap-2 rounded-full bg-brand-primary-soft px-3 py-1.5 text-xs font-semibold text-brand-red">
                  <Sparkles aria-hidden="true" className="size-3.5" />
                  {nextEvent.category}
                </span>
                <h3 className="mt-4 font-heading text-xl font-bold text-charcoal sm:text-2xl">
                  {nextEvent.title}
                </h3>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                  <span className="inline-flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="size-4 text-brand-gold" />
                    {formatEventDate(nextEvent.startAt, locale)}
                  </span>
                  {nextEvent.venue && (
                    <span className="inline-flex items-center gap-2">
                      <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
                      {nextEvent.venue}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border bg-[#fbf9f5] px-5 py-4 sm:min-w-52 sm:flex-col sm:items-start sm:justify-center sm:border-l sm:border-t-0 sm:px-6">
                <p className="inline-flex items-center gap-2 text-sm font-semibold text-brand-deep-blue">
                  <Clock3 aria-hidden="true" className="size-4" />
                  {countdown(nextEvent.startAt, now)}
                </p>
                <Link
                  href={`/${locale}/dashboard/user/tickets`}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93630]"
                >
                  View ticket <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </div>
            </div>
          </article>
        ) : (
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-border-strong bg-white p-6 sm:flex-row sm:items-center">
            <div>
              <h3 className="font-heading text-lg font-semibold text-charcoal">
                Nothing on your calendar yet
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                Find an event you love and your tickets will show up here.
              </p>
            </div>
            <Link
              href={`/${locale}/events`}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93630]"
            >
              Browse events <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        )}
      </section>

      <section id="past-events" className="mt-10 scroll-mt-28">
        <div className="mb-4">
          <p className="text-sm font-semibold text-brand-red">Your highlights</p>
          <h2 className="mt-1 font-heading text-xl font-bold text-charcoal sm:text-2xl">
            Past events
          </h2>
        </div>
        <Link
          href={`/${locale}/dashboard/past`}
          className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 transition hover:border-brand-gold sm:p-6"
        >
          <span className="flex items-center gap-4">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-success-soft text-success">
              <Check aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block font-semibold text-charcoal">
                {stats.attendedEvents} {stats.attendedEvents === 1 ? "event" : "events"} attended
              </span>
              <span className="mt-1 block text-sm text-text-secondary">
                Your scanned tickets and event history
              </span>
            </span>
          </span>
          <ArrowRight aria-hidden="true" className="size-5 shrink-0 text-text-muted" />
        </Link>
      </section>

      <section className="mt-10 pb-2">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-brand-red">Picked for you</p>
            <h2 className="mt-1 font-heading text-xl font-bold text-charcoal sm:text-2xl">
              Recommended events
            </h2>
          </div>
          <Link
            href={`/${locale}/events`}
            className="inline-flex items-center gap-1 text-sm font-semibold text-charcoal hover:text-brand-red"
          >
            Browse all <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        {recommendations.length > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.map((event) => (
              <article
                key={event.id}
                className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1)"
              >
                <span className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                  {event.category}
                </span>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="mt-2 font-heading text-lg font-semibold text-charcoal">
                    {event.title}
                  </h3>
                  <SaveEventButton
                    eventId={event.id}
                    isSaved={savedEventIds.has(event.id)}
                  />
                </div>
                <div className="mt-3 space-y-2 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <CalendarDays aria-hidden="true" className="size-4 text-brand-gold" />
                    {formatEventDate(event.startAt, locale)}
                  </p>
                  {event.venue && (
                    <p className="flex items-center gap-2">
                      <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
                      {event.venue}
                    </p>
                  )}
                </div>
                <p className="mt-4 border-t border-border pt-3 text-sm font-semibold text-charcoal">
                  {event.isFree ? "Free entry" : "Tickets available"}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-white p-6 text-sm text-text-secondary">
            No upcoming events to recommend right now. Check back soon.
          </div>
        )}
      </section>
    </main>
  );
}

function StatCard({
  href,
  label,
  value,
  icon,
  detail,
  accent,
}: {
  href: string;
  label: string;
  value: number;
  icon: ReactNode;
  detail: string;
  accent: "red" | "gold" | "blue";
}) {
  const accentClasses = {
    red: "bg-brand-primary-soft text-brand-red",
    gold: "bg-[#f8f0df] text-[#a86400]",
    blue: "bg-brand-secondary-soft text-brand-deep-blue",
  }[accent];

  return (
    <Link
      href={href}
      className="rounded-2xl border border-border bg-white p-4 shadow-(--shadow-1) transition hover:-translate-y-0.5 hover:shadow-(--shadow-2) sm:p-5"
    >
      <span className={`flex size-10 items-center justify-center rounded-xl ${accentClasses}`}>
        {icon}
      </span>
      <span className="mt-4 block text-sm font-medium text-text-secondary">{label}</span>
      <span className="mt-1 block font-heading text-2xl font-bold text-charcoal">
        {value}
      </span>
      <span className="mt-1 block text-xs text-text-muted">{detail}</span>
    </Link>
  );
}

function formatEventDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  }).format(date);
}

function countdown(eventDate: Date, now: Date) {
  const days = Math.ceil((eventDate.getTime() - now.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `${days} days to go`;
}
