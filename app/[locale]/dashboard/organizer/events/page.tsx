import type { Metadata } from "next";
import Link from "next/link";
import { and, eq, ilike, or, sql } from "drizzle-orm";
import { Plus } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bookings, events } from "@/server/src/db/schema";
import { OrganizerEventList } from "@/components/dashboard/OrganizerEventList";

export const metadata: Metadata = { title: "My Events | AddisEvent" };

const VALID_STATUSES = ["draft", "published", "completed", "cancelled"] as const;
type StatusFilter = (typeof VALID_STATUSES)[number] | "all";

export default async function OrganizerEventsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const [{ locale }, sp, session] = await Promise.all([params, searchParams, auth()]);
  if (!session?.user?.id) return null;

  const statusFilter = (
    VALID_STATUSES.includes(sp.status as (typeof VALID_STATUSES)[number])
      ? sp.status
      : "all"
  ) as StatusFilter;
  const q = sp.q?.trim() ?? "";

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      imageUrl: events.imageUrl,
      startAt: events.startAt,
      venue: events.venue,
      venueAddress: events.venueAddress,
      city: events.city,
      status: events.status,
      totalCapacity: events.totalCapacity,
      ticketsSold: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid'), 0)`.as("tickets_sold"),
      revenue: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid'), 0)`.as("revenue"),
    })
    .from(events)
    .leftJoin(bookings, eq(bookings.eventId, events.id))
    .where(
      and(
        eq(events.organizerId, session.user.id),
        statusFilter !== "all" ? eq(events.status, statusFilter) : undefined,
        q
          ? or(
              ilike(events.title, `%${q}%`),
              ilike(sql`${events.startAt}::text`, `%${q}%`),
            )
          : undefined,
      ),
    )
    .groupBy(events.id)
    .orderBy(sql`${events.startAt} desc`)
    .catch(() => []);

  const tabs: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold text-charcoal">My Events</h1>
          <p className="mt-1 text-sm text-text-secondary">All your events in one place.</p>
        </div>
        <Link
          href={`/${locale}/organizer/events/new`}
          className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(224,64,56,0.2)] transition hover:bg-[#c93630]"
        >
          <Plus className="size-4" aria-hidden="true" />
          New Event
        </Link>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map(({ label, value }) => {
            const active = statusFilter === value;
            return (
              <Link
                key={value}
                href={`/${locale}/organizer/events?status=${value}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  active
                    ? "bg-brand-red text-white"
                    : "border border-border bg-white text-charcoal hover:border-brand-gold"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
        <form method="GET" action={`/${locale}/organizer/events`} className="flex gap-2">
          {statusFilter !== "all" && (
            <input type="hidden" name="status" value={statusFilter} />
          )}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or date…"
            className="h-10 w-64 rounded-full border border-border bg-white px-4 text-sm text-charcoal placeholder:text-text-muted focus:border-brand-red focus:outline-none"
          />
        </form>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
          <p className="font-heading text-xl font-bold text-charcoal">
            {q || statusFilter !== "all"
              ? "No events match your filters."
              : "You haven't created any events yet."}
          </p>
          <p className="mt-2 text-sm text-text-secondary">
            {q || statusFilter !== "all"
              ? "Try adjusting your search or filter."
              : "Get started by creating your first event."}
          </p>
          {!q && statusFilter === "all" && (
            <Link
              href={`/${locale}/organizer/events/new`}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#c93630]"
            >
              <Plus className="size-4" aria-hidden="true" />
              Create Your First Event
            </Link>
          )}
        </div>
      ) : (
        <OrganizerEventList locale={locale} events={rows as Parameters<typeof OrganizerEventList>[0]["events"]} />
      )}
    </main>
  );
}
