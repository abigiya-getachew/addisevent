import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { and, count, eq, sql, sum } from "drizzle-orm";
import { CalendarDays, Copy, MapPin, Pencil } from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import {
  bookings,
  events,
  organizerPayouts,
  payments,
  ticketTiers,
  tickets,
  users,
} from "@/server/src/db/schema";
import { EventMoreActions } from "@/components/dashboard/EventMoreActions";
import { ShareEventButton } from "@/components/dashboard/ShareEventButton";
import { markOrganizerTicketCheckedIn } from "@/app/[locale]/organizer/actions";

export const metadata: Metadata = { title: "Event Management | AddisEvent" };

const TABS = ["overview", "attendees", "tiers", "payments", "settings"] as const;
type Tab = (typeof TABS)[number];

const TAB_LABELS: Record<Tab, string> = {
  overview: "Overview",
  attendees: "Attendees",
  tiers: "Ticket Tiers",
  payments: "Payments & Payouts",
  settings: "Settings",
};

const STATUS_STYLES = {
  published: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  draft: "bg-amber-50 text-amber-800 ring-1 ring-amber-200",
  completed: "bg-zinc-100 text-zinc-700 ring-1 ring-zinc-200",
  cancelled: "bg-red-50 text-red-700 ring-1 ring-red-200",
};

export default async function OrganizerEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ tab?: string; cancelled?: string }>;
}) {
  const [{ locale, id }, sp, session] = await Promise.all([params, searchParams, auth()]);
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);

  const tab: Tab = TABS.includes(sp.tab as Tab) ? (sp.tab as Tab) : "overview";

  const [event] = await db
    .select()
    .from(events)
    .where(and(eq(events.id, id), eq(events.organizerId, session.user.id)))
    .limit(1);

  if (!event) notFound();

  // ── Overview data ──────────────────────────────────────────────────────────
  const tierStats = await db
    .select({
      tierId: ticketTiers.id,
      tierName: ticketTiers.name,
      price: ticketTiers.price,
      totalQuantity: ticketTiers.totalQuantity,
      availableQuantity: ticketTiers.availableQuantity,
      sold: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid'), 0)`.as("sold"),
      revenue: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid'), 0)`.as("revenue"),
    })
    .from(ticketTiers)
    .leftJoin(bookings, and(eq(bookings.tierId, ticketTiers.id), eq(bookings.status, "paid")))
    .where(and(eq(ticketTiers.eventId, id), eq(ticketTiers.isActive, true)))
    .groupBy(ticketTiers.id);

  const totalRevenue = tierStats.reduce((s, t) => s + Number(t.revenue), 0);
  const totalSold = tierStats.reduce((s, t) => s + Number(t.sold), 0);

  // ── Attendees data ─────────────────────────────────────────────────────────
  const attendeeRows =
    tab === "attendees"
      ? await db
          .select({
            ticketId: tickets.id,
            qrUuid: tickets.qrUuid,
            status: tickets.status,
            scannedAt: tickets.scannedAt,
            bookingId: bookings.id,
            quantity: bookings.quantity,
            guestName: bookings.guestName,
            guestPhone: bookings.guestPhone,
            userName: users.name,
            userPhone: users.phone,
            tierName: ticketTiers.name,
          })
          .from(tickets)
          .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
          .innerJoin(ticketTiers, eq(bookings.tierId, ticketTiers.id))
          .leftJoin(users, eq(bookings.userId, users.id))
          .where(and(eq(bookings.eventId, id), eq(bookings.status, "paid")))
          .orderBy(sql`${tickets.issuedAt} desc`)
      : [];

  // ── Payments data ──────────────────────────────────────────────────────────
  const payoutRows =
    tab === "payments"
      ? await db
          .select()
          .from(organizerPayouts)
          .where(and(eq(organizerPayouts.organizerId, session.user.id), eq(organizerPayouts.eventId, id)))
          .orderBy(sql`${organizerPayouts.createdAt} desc`)
      : [];

  const platformFeeRate = 0.05;
  const platformFee = totalRevenue * platformFeeRate;
  const payoutAmount = totalRevenue - platformFee;

  const date = new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-ET", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(event.startAt);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-heading text-2xl font-bold text-charcoal sm:text-3xl">{event.title}</h1>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[event.status]}`}>
              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
            </span>
          </div>
          <p className="mt-2 flex flex-wrap items-center gap-4 text-sm text-text-secondary">
            <span className="flex items-center gap-1.5"><CalendarDays className="size-4" />{date}</span>
            {event.venue && <span className="flex items-center gap-1.5"><MapPin className="size-4" />{[event.venue, event.city].filter(Boolean).join(" · ")}</span>}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Link
            href={`/${locale}/organizer/events/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold"
          >
            <Pencil className="size-4" />
            Edit
          </Link>
          <ShareEventButton path={`/${locale}/events/${id}`} />
          <EventMoreActions eventId={id} status={event.status} />
        </div>
      </div>

      {sp.cancelled && (
        <div className="mb-6 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800 ring-1 ring-amber-200">
          Event cancelled. Buyers have not been automatically notified — please contact them directly.
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-white p-1.5">
        {TABS.map((t) => (
          <Link
            key={t}
            href={`/${locale}/organizer/events/${id}?tab=${t}`}
            className={`flex-1 rounded-xl px-3 py-2 text-center text-sm font-semibold whitespace-nowrap transition ${
              tab === t ? "bg-brand-red text-white shadow-sm" : "text-text-secondary hover:text-charcoal"
            }`}
          >
            {TAB_LABELS[t]}
          </Link>
        ))}
      </div>

      {/* ── Tab: Overview ── */}
      {tab === "overview" && (
        <div className="space-y-6">
          {/* KPI row */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Revenue", value: `ETB ${totalRevenue.toLocaleString()}` },
              { label: "Tickets Sold", value: `${totalSold} / ${event.totalCapacity}` },
              { label: "Available", value: `${event.availableCapacity}` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="mt-2 font-heading text-3xl font-bold text-charcoal">{value}</p>
              </div>
            ))}
          </div>

          {/* Tier breakdown */}
          <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <h2 className="mb-4 font-heading text-lg font-bold text-charcoal">Revenue by Tier</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <th className="pb-3 pr-4">Tier</th>
                    <th className="pb-3 pr-4">Price</th>
                    <th className="pb-3 pr-4">Sold</th>
                    <th className="pb-3 pr-4">Capacity</th>
                    <th className="pb-3">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {tierStats.map((t) => (
                    <tr key={t.tierId} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4 font-semibold text-charcoal">{t.tierName}</td>
                      <td className="py-3 pr-4 text-text-secondary">ETB {Number(t.price).toLocaleString()}</td>
                      <td className="py-3 pr-4 text-charcoal">{t.sold}</td>
                      <td className="py-3 pr-4 text-text-secondary">{t.totalQuantity}</td>
                      <td className="py-3 font-semibold text-charcoal">ETB {Number(t.revenue).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Attendees ── */}
      {tab === "attendees" && (
        <div className="rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
            <h2 className="font-heading text-lg font-bold text-charcoal">
              Attendees <span className="ml-1 text-sm font-normal text-text-secondary">({attendeeRows.length})</span>
            </h2>
          </div>
          {attendeeRows.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-text-secondary">No paid attendees yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <th className="px-5 py-3">Name / Phone</th>
                    <th className="px-5 py-3">Ticket Type</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Check-in Time</th>
                    <th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {attendeeRows.map((row) => (
                    <tr key={row.ticketId} className="border-b border-border/60 last:border-0">
                      <td className="px-5 py-3">
                        <div className="font-semibold text-charcoal">{row.userName ?? row.guestName ?? "—"}</div>
                        <div className="text-xs text-text-secondary">{row.userPhone ?? row.guestPhone ?? ""}</div>
                      </td>
                      <td className="px-5 py-3 text-charcoal">{row.tierName}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            row.status === "scanned"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
                          }`}
                        >
                          {row.status === "scanned" ? "Checked In" : "Issued"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-text-secondary">
                        {row.scannedAt
                          ? new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-ET", { dateStyle: "short", timeStyle: "short" }).format(row.scannedAt)
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        {row.status === "issued" && (
                          <form action={markOrganizerTicketCheckedIn}>
                            <input type="hidden" name="eventId" value={id} />
                            <input type="hidden" name="ticketId" value={row.ticketId} />
                            <button
                              type="submit"
                              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-charcoal transition hover:border-brand-gold"
                            >
                              Mark Checked In
                            </button>
                          </form>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Ticket Tiers ── */}
      {tab === "tiers" && (
        <div className="space-y-4">
          {tierStats.map((t) => (
            <div key={t.tierId} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
              <div>
                <p className="font-heading text-lg font-bold text-charcoal">{t.tierName}</p>
                <p className="mt-1 text-sm text-text-secondary">
                  ETB {Number(t.price).toLocaleString()} · {t.sold} sold · {t.availableQuantity} remaining
                </p>
              </div>
              <Link
                href={`/${locale}/organizer/events/${id}/edit`}
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold"
              >
                <Pencil className="size-4" />
                Edit Tier
              </Link>
            </div>
          ))}
          <Link
            href={`/${locale}/organizer/events/${id}/edit`}
            className="inline-flex items-center gap-2 rounded-full border border-dashed border-brand-gold px-5 py-2.5 text-sm font-semibold text-[#8A6A2C] transition hover:bg-[#fff4db]"
          >
            <span className="text-lg leading-none">+</span>
            Add Tier
          </Link>
        </div>
      )}

      {/* ── Tab: Payments & Payouts ── */}
      {tab === "payments" && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Total Collected", value: `ETB ${totalRevenue.toLocaleString()}` },
              { label: "Platform Fee (5%)", value: `ETB ${platformFee.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
              { label: "Your Payout", value: `ETB ${payoutAmount.toLocaleString(undefined, { maximumFractionDigits: 2 })}` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="mt-2 font-heading text-2xl font-bold text-charcoal">{value}</p>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <h2 className="mb-4 font-heading text-lg font-bold text-charcoal">Payout History</h2>
            {payoutRows.length === 0 ? (
              <p className="text-sm text-text-secondary">No payouts processed yet.</p>
            ) : (
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <th className="pb-3 pr-4">Date</th>
                    <th className="pb-3 pr-4">Amount</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutRows.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="py-3 pr-4 text-text-secondary">
                        {new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-ET", { dateStyle: "medium" }).format(p.createdAt)}
                      </td>
                      <td className="py-3 pr-4 font-semibold text-charcoal">ETB {Number(p.amount).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            p.status === "sent"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                              : p.status === "failed"
                                ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                                : "bg-amber-50 text-amber-800 ring-1 ring-amber-200"
                          }`}
                        >
                          {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-xs text-text-secondary">{p.referenceId ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: Settings ── */}
      {tab === "settings" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <h2 className="mb-2 font-heading text-lg font-bold text-charcoal">Event Settings</h2>
            <p className="mb-4 text-sm text-text-secondary">Edit event details or manage its lifecycle.</p>
            <Link
              href={`/${locale}/organizer/events/${id}/edit`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93630]"
            >
              <Pencil className="size-4" />
              Edit Event Details
            </Link>
          </div>

          {(event.status === "draft" || event.status === "published") && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="mb-1 font-heading text-lg font-bold text-red-800">Danger Zone</h2>
              <p className="mb-4 text-sm text-red-700">
                Cancelling this event will change its status. All buyers should be notified and refunds processed manually.
              </p>
              <EventMoreActions eventId={id} status={event.status} />
            </div>
          )}
        </div>
      )}
    </main>
  );
}
