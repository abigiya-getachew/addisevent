import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, events, users } from "@/server/src/db/schema";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "All Events | AddisEvent" };

const STATUSES = ["all", "draft", "published", "completed", "cancelled"] as const;
const CATEGORIES = ["all", "Music", "Festival", "Workshop", "Community", "Sports", "Other"] as const;

export default async function AdminEventsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; category?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as (typeof STATUSES)[number]) ? sp.status as (typeof STATUSES)[number] : "all";
  const category = CATEGORIES.includes(sp.category as (typeof CATEGORIES)[number]) ? sp.category as (typeof CATEGORIES)[number] : "all";
  const q = sp.q?.trim() ?? "";

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      status: events.status,
      category: events.category,
      startAt: events.startAt,
      venue: events.venue,
      city: events.city,
      totalCapacity: events.totalCapacity,
      organizerName: users.name,
      organizerEmail: users.email,
      ticketsSold: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid'), 0)`,
    })
    .from(events)
    .leftJoin(users, eq(events.organizerId, users.id))
    .leftJoin(bookings, eq(bookings.eventId, events.id))
    .where(
      and(
        status !== "all" ? eq(events.status, status as "draft" | "published" | "completed" | "cancelled") : undefined,
        category !== "all" ? eq(events.category, category) : undefined,
        q ? ilike(events.title, `%${q}%`) : undefined,
      ),
    )
    .groupBy(events.id, users.id)
    .orderBy(desc(events.createdAt))
    .limit(50)
    .catch(() => []);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({ status, category, ...(q ? { q } : {}), ...overrides });
    return `/admin/events?${params}`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="All Events" description="Moderate, feature, and manage every event." />

      {/* Filters */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <Link key={s} href={buildHref({ status: s })}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${status === s ? "bg-[#102442] text-white" : "border border-border bg-white text-charcoal hover:border-[#102442]"}`}>
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <Link key={c} href={buildHref({ category: c })}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${category === c ? "bg-brand-gold text-charcoal" : "border border-border bg-white text-charcoal hover:border-brand-gold"}`}>
                {c.charAt(0).toUpperCase() + c.slice(1)}
              </Link>
            ))}
          </div>
          <form method="GET" action="/admin/events" className="ml-auto flex gap-2">
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="category" value={category} />
            <input name="q" defaultValue={q} placeholder="Search event name…"
              className="h-9 w-56 rounded-full border border-border bg-white px-4 text-sm focus:border-[#102442] focus:outline-none" />
          </form>
        </div>
      </div>

      <AdminTable headers={["Event", "Organizer", "Date", "Status", "Sold / Cap", "Actions"]}>
        <>
          {rows.length === 0 && (
            <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-text-secondary">No events found.</td></tr>
          )}
          {rows.map((e) => (
            <tr key={e.id} className="border-b border-border/60 last:border-0 hover:bg-[#faf8f4]">
              <td className="px-5 py-3">
                <p className="font-semibold text-charcoal">{e.title}</p>
                <p className="text-xs text-text-secondary">{e.category} · {e.city}</p>
              </td>
              <td className="px-5 py-3 text-sm text-text-secondary">{e.organizerName ?? e.organizerEmail ?? "—"}</td>
              <td className="px-5 py-3 text-sm text-text-secondary">
                {new Intl.DateTimeFormat("en-ET", { dateStyle: "medium" }).format(e.startAt)}
              </td>
              <td className="px-5 py-3"><StatusBadge status={e.status} /></td>
              <td className="px-5 py-3 text-sm text-charcoal">{e.ticketsSold} / {e.totalCapacity}</td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <Link href={`/en/events/${e.id}`} className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-charcoal transition hover:border-[#102442]">
                    View
                  </Link>
                  <Link href={`/en/organizer/events/${e.id}/edit`} className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-charcoal transition hover:border-brand-gold">
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </>
      </AdminTable>
    </div>
  );
}
