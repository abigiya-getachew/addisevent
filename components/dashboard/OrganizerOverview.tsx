import Link from "next/link";
import { and, desc, eq, gte, sql } from "drizzle-orm";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  CircleDollarSign,
  MapPin,
  Plus,
  Ticket,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { bookings, events, tickets, users } from "@/server/src/db/schema";

async function getOrganizerStats(organizerId: string) {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [summary, recentSales, upcomingEvents] = await Promise.all([
    // All-time + this-month KPIs
    db
      .select({
        totalRevenue: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid'), 0)`,
        monthRevenue: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid' and ${bookings.createdAt} >= ${thirtyDaysAgo}), 0)`,
        totalSold: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid'), 0)`,
        activeEvents: sql<number>`count(distinct ${events.id}) filter (where ${events.status} = 'published')`,
        checkedIn: sql<number>`coalesce(count(${tickets.id}) filter (where ${tickets.status} = 'scanned'), 0)`,
      })
      .from(events)
      .leftJoin(bookings, eq(bookings.eventId, events.id))
      .leftJoin(tickets, eq(tickets.bookingId, bookings.id))
      .where(eq(events.organizerId, organizerId))
      .then((r) => r[0])
      .catch(() => null),

    // Recent paid bookings
    db
      .select({
        buyerName: users.name,
        buyerPhone: users.phone,
        guestName: bookings.guestName,
        guestPhone: bookings.guestPhone,
        eventTitle: events.title,
        quantity: bookings.quantity,
        totalAmount: bookings.totalAmount,
        paymentMethod: bookings.paymentMethod,
        createdAt: bookings.createdAt,
        status: bookings.status,
      })
      .from(bookings)
      .innerJoin(events, eq(bookings.eventId, events.id))
      .leftJoin(users, eq(bookings.userId, users.id))
      .where(and(eq(events.organizerId, organizerId), eq(bookings.status, "paid")))
      .orderBy(desc(bookings.createdAt))
      .limit(5)
      .catch(() => []),

    // Upcoming published events
    db
      .select({
        id: events.id,
        title: events.title,
        imageUrl: events.imageUrl,
        startAt: events.startAt,
        venue: events.venue,
        city: events.city,
        totalCapacity: events.totalCapacity,
        availableCapacity: events.availableCapacity,
        ticketsSold: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid'), 0)`,
        revenue: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid'), 0)`,
      })
      .from(events)
      .leftJoin(bookings, eq(bookings.eventId, events.id))
      .where(
        and(
          eq(events.organizerId, organizerId),
          eq(events.status, "published"),
          gte(events.startAt, new Date()),
        ),
      )
      .groupBy(events.id)
      .orderBy(events.startAt)
      .limit(3)
      .catch(() => []),
  ]);

  return { summary, recentSales, upcomingEvents };
}

function formatMethod(method: string | null) {
  if (method === "telebirr") return "Telebirr";
  if (method === "cbebirr") return "CBE Birr";
  if (method === "chapa") return "Chapa";
  if (method === "pay_at_gate") return "Gate";
  return "Paid";
}

function timeAgo(date: Date) {
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export async function OrganizerOverview() {
  const session = await auth();
  const organizerId = session?.user?.id;
  const name = session?.user?.name ?? "Organizer";

  const { summary, recentSales, upcomingEvents } = organizerId
    ? await getOrganizerStats(organizerId)
    : { summary: null, recentSales: [], upcomingEvents: [] };

  const totalRevenue = Number(summary?.totalRevenue ?? 0);
  const monthRevenue = Number(summary?.monthRevenue ?? 0);
  const totalSold = Number(summary?.totalSold ?? 0);
  const activeEvents = Number(summary?.activeEvents ?? 0);
  const checkedIn = Number(summary?.checkedIn ?? 0);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ── Hero header ─────────────────────────────────────────────────────── */}
      <header className="relative mb-10 overflow-hidden rounded-3xl bg-[#102442] px-8 py-10 shadow-[0_24px_64px_rgba(16,36,66,0.28)]">
        {/* background texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #fff 0.6px, transparent 0.6px)",
            backgroundSize: "22px 22px",
          }}
        />
        {/* glow blobs */}
        <div aria-hidden="true" className="pointer-events-none absolute -top-20 -right-20 size-72 rounded-full bg-brand-red opacity-20 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-16 left-10 size-56 rounded-full bg-brand-gold opacity-15 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
              Organizer Console
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-white sm:text-4xl">
              Welcome back, {name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Here's what's happening with your events right now.
            </p>
          </div>
          <Link
            href="/organizer/events/new"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-red px-6 py-3 text-sm font-bold text-white shadow-[0_8px_24px_rgba(224,64,56,0.4)] transition hover:bg-[#c93630]"
          >
            <Plus className="size-4" aria-hidden="true" />
            New Event
          </Link>
        </div>
      </header>

      {/* ── KPI cards ───────────────────────────────────────────────────────── */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total Revenue",
            value: `ETB ${totalRevenue.toLocaleString()}`,
            sub: `+ETB ${monthRevenue.toLocaleString()} this month`,
            icon: CircleDollarSign,
            accent: "bg-[#FFF3F3] text-brand-red",
          },
          {
            label: "Tickets Sold",
            value: totalSold.toLocaleString(),
            sub: "All-time paid bookings",
            icon: Ticket,
            accent: "bg-[#F0F9FF] text-brand-deep-blue",
          },
          {
            label: "Live Events",
            value: activeEvents.toString(),
            sub: "Published & upcoming",
            icon: CalendarDays,
            accent: "bg-[#F5F2EA] text-[#8A6A2C]",
          },
          {
            label: "Checked In",
            value: checkedIn.toLocaleString(),
            sub: "Total scanned tickets",
            icon: Users,
            accent: "bg-[#EFFAF5] text-[#1E8F60]",
          },
        ].map(({ label, value, sub, icon: Icon, accent }) => (
          <article
            key={label}
            className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm text-text-secondary">{label}</p>
                <p className="mt-2 font-heading text-3xl font-bold text-charcoal">{value}</p>
              </div>
              <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="size-5" aria-hidden="true" />
              </div>
            </div>
            <p className="mt-3 flex items-center gap-1.5 text-xs text-text-muted">
              <TrendingUp className="size-3.5 text-brand-red" aria-hidden="true" />
              {sub}
            </p>
          </article>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">

        {/* ── Upcoming events ──────────────────────────────────────────────── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-charcoal">Upcoming Events</h2>
            <Link
              href="/organizer/events"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-red hover:underline"
            >
              All events <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>

          {upcomingEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-16 text-center">
              <CalendarDays className="mb-3 size-10 text-border" aria-hidden="true" />
              <p className="font-heading text-lg font-bold text-charcoal">No upcoming events</p>
              <p className="mt-1 text-sm text-text-secondary">Publish an event to see it here.</p>
              <Link
                href="/organizer/events/new"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#c93630]"
              >
                <Plus className="size-4" aria-hidden="true" />
                Create Event
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map((event) => {
                const sold = Number(event.ticketsSold);
                const pct = event.totalCapacity > 0 ? Math.round((sold / event.totalCapacity) * 100) : 0;
                const dateStr = new Intl.DateTimeFormat("en-ET", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(event.startAt);

                return (
                  <Link
                    key={event.id}
                    href={`/organizer/events/${event.id}`}
                    className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.03)] transition hover:-translate-y-0.5 hover:border-brand-gold hover:shadow-[0_12px_32px_rgba(205,164,80,0.12)]"
                  >
                    {/* poster */}
                    <div
                      className="hidden size-20 shrink-0 rounded-xl bg-[linear-gradient(135deg,#ffe7d6_0%,#f7e9cd_100%)] bg-cover bg-center sm:block"
                      style={event.imageUrl ? { backgroundImage: `url("${event.imageUrl}")` } : undefined}
                      aria-hidden="true"
                    />

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-base font-bold text-charcoal leading-snug group-hover:text-brand-red transition-colors">
                          {event.title}
                        </h3>
                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          Live
                        </span>
                      </div>

                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-text-secondary">
                        <span className="flex items-center gap-1"><CalendarDays className="size-3.5" />{dateStr}</span>
                        {event.venue && <span className="flex items-center gap-1"><MapPin className="size-3.5" />{event.venue}</span>}
                      </p>

                      {/* capacity bar */}
                      <div className="mt-3">
                        <div className="mb-1 flex items-center justify-between text-xs">
                          <span className="text-text-secondary">{sold} sold / {event.totalCapacity} capacity</span>
                          <span className="font-semibold text-charcoal">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-soft-stone">
                          <div
                            className="h-full rounded-full bg-brand-red transition-all"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>

                      <p className="mt-2 text-xs font-semibold text-charcoal">
                        ETB {Number(event.revenue).toLocaleString()}
                        <span className="ml-1 font-normal text-text-secondary">revenue</span>
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Right column ─────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Quick actions */}
          <aside className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <div className="mb-4 flex items-center gap-2">
              <Zap className="size-4 text-brand-gold" aria-hidden="true" />
              <h2 className="font-heading text-lg font-bold text-charcoal">Quick Actions</h2>
            </div>
            <div className="space-y-2">
              {[
                { label: "My Events", desc: "View & manage all your events", href: "/organizer/events", icon: BarChart3, style: "border border-border hover:border-brand-gold hover:bg-[#fffdf7]" },
                { label: "Payouts & Settings", desc: "Track transfers, update payout info", href: "/organizer/settings", icon: CircleDollarSign, style: "border border-border hover:border-brand-red hover:bg-[#fff7f7]" },
              ].map(({ label, desc, href, icon: Icon, style }) => (
                <Link
                  key={label}
                  href={href}
                  className={`flex items-center justify-between gap-3 rounded-xl p-3.5 transition ${style}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-soft-stone">
                      <Icon className="size-4 text-charcoal" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{label}</p>
                      <p className="text-xs text-text-secondary">{desc}</p>
                    </div>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>

          {/* Recent sales */}
          <aside className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-heading text-lg font-bold text-charcoal">Recent Sales</h2>
              <Link href="/organizer/events" className="text-xs font-semibold text-brand-red hover:underline">
                View all
              </Link>
            </div>

            {recentSales.length === 0 ? (
              <p className="py-6 text-center text-sm text-text-secondary">No sales yet.</p>
            ) : (
              <ul className="space-y-3">
                {recentSales.map((sale, i) => {
                  const buyer = sale.buyerName ?? sale.guestName ?? "Guest";
                  const phone = sale.buyerPhone ?? sale.guestPhone ?? "";
                  return (
                    <li key={i} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-charcoal">{buyer}</p>
                        <p className="truncate text-xs text-text-secondary">{sale.eventTitle}</p>
                        <p className="mt-0.5 text-xs text-text-muted">
                          {sale.quantity} ticket{sale.quantity !== 1 ? "s" : ""} · {formatMethod(sale.paymentMethod)}
                        </p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-charcoal">ETB {Number(sale.totalAmount).toLocaleString()}</p>
                        <p className="text-xs text-text-muted">{timeAgo(sale.createdAt)}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}
