import type { Metadata } from "next";
import Link from "next/link";
import { desc, eq, gte, sql } from "drizzle-orm";
import {
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Ticket,
  Users,
} from "lucide-react";
import { db } from "@/lib/db";
import { bookings, events, payments, users } from "@/server/src/db/schema";
import { StatCard } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "Admin Dashboard | AddisEvent" };

export default async function AdminDashboardPage() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [kpis, recentUsers, recentEvents, recentBookings, failedPayments] =
    await Promise.all([
      db
        .select({
          totalUsers: sql<number>`count(distinct ${users.id})`,
          totalOrganizers: sql<number>`count(distinct ${users.id}) filter (where ${users.role} = 'organizer')`,
          totalEvents: sql<number>`count(distinct ${events.id})`,
          publishedEvents: sql<number>`count(distinct ${events.id}) filter (where ${events.status} = 'published')`,
          ticketsSold: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid'), 0)`,
          monthTickets: sql<number>`coalesce(sum(${bookings.quantity}) filter (where ${bookings.status} = 'paid' and ${bookings.createdAt} >= ${thirtyDaysAgo}), 0)`,
          totalRevenue: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid'), 0)`,
          failedCount: sql<number>`count(${payments.id}) filter (where ${payments.status} = 'failed')`,
        })
        .from(users)
        .leftJoin(events, sql`true`)
        .leftJoin(bookings, sql`true`)
        .leftJoin(payments, sql`true`)
        .then((r) => r[0])
        .catch(() => null),

      db
        .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(5)
        .catch(() => []),

      db
        .select({ id: events.id, title: events.title, status: events.status, createdAt: events.createdAt })
        .from(events)
        .orderBy(desc(events.createdAt))
        .limit(5)
        .catch(() => []),

      db
        .select({ id: bookings.id, totalAmount: bookings.totalAmount, status: bookings.status, createdAt: bookings.createdAt })
        .from(bookings)
        .where(eq(bookings.status, "paid"))
        .orderBy(desc(bookings.createdAt))
        .limit(5)
        .catch(() => []),

      db
        .select({ id: payments.id, amount: payments.amount, status: payments.status, createdAt: payments.createdAt })
        .from(payments)
        .where(eq(payments.status, "failed"))
        .orderBy(desc(payments.createdAt))
        .limit(3)
        .catch(() => []),
    ]);

  const platformFee = Number(kpis?.totalRevenue ?? 0) * 0.05;

  function timeAgo(date: Date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#102442]">Admin Console</p>
          <h1 className="mt-1 font-heading text-3xl font-bold text-charcoal">Platform Overview</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Users", href: "/admin/users" },
            { label: "Events", href: "/admin/events" },
            { label: "Payments", href: "/admin/payments" },
            { label: "Reports", href: "/admin/reports" },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-border bg-white px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-[#102442] hover:text-[#102442]"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      {/* KPI grid */}
      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Total Users"
          value={(kpis?.totalUsers ?? 0).toLocaleString()}
          sub={`${kpis?.totalOrganizers ?? 0} organizers`}
          icon={Users}
          accent="bg-[#EEF2FF] text-[#102442]"
        />
        <StatCard
          label="Events"
          value={(kpis?.totalEvents ?? 0).toLocaleString()}
          sub={`${kpis?.publishedEvents ?? 0} published`}
          icon={CalendarDays}
          accent="bg-[#F5F2EA] text-[#8A6A2C]"
        />
        <StatCard
          label="Tickets Sold"
          value={(kpis?.ticketsSold ?? 0).toLocaleString()}
          sub={`${kpis?.monthTickets ?? 0} this month`}
          icon={Ticket}
          accent="bg-[#EFFAF5] text-[#1E8F60]"
        />
        <StatCard
          label="Platform Revenue"
          value={`ETB ${platformFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
          sub={`5% of ETB ${Number(kpis?.totalRevenue ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })} gross`}
          icon={CircleDollarSign}
          accent="bg-[#FFF3F3] text-brand-red"
        />
        <StatCard
          label="Check-in Rate"
          value="—"
          sub="Scan data available after events"
          icon={CheckCircle2}
          accent="bg-[#F0F9FF] text-[#102442]"
        />
        <StatCard
          label="Failed Payments"
          value={(kpis?.failedCount ?? 0).toString()}
          sub="Requires attention"
          icon={AlertTriangle}
          accent="bg-red-50 text-red-600"
        />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Recent activity */}
        <section className="space-y-6">
          {/* Recent signups */}
          <div className="rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-heading text-base font-bold text-charcoal">Latest Signups</h2>
              <Link href="/admin/users" className="text-xs font-semibold text-[#102442] hover:underline">View all</Link>
            </div>
            <ul className="divide-y divide-border">
              {recentUsers.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-text-secondary">No users yet.</li>
              )}
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{u.name ?? "—"}</p>
                    <p className="text-xs text-text-secondary">{u.email ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${u.role === "organizer" ? "bg-[#EEF2FF] text-[#102442]" : u.role === "admin" ? "bg-red-50 text-red-700" : "bg-soft-stone text-text-secondary"}`}>
                      {u.role}
                    </span>
                    <p className="mt-0.5 text-xs text-text-muted">{timeAgo(u.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newly published events */}
          <div className="rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-heading text-base font-bold text-charcoal">Newly Published Events</h2>
              <Link href="/admin/events" className="text-xs font-semibold text-[#102442] hover:underline">View all</Link>
            </div>
            <ul className="divide-y divide-border">
              {recentEvents.length === 0 && (
                <li className="px-5 py-6 text-center text-sm text-text-secondary">No events yet.</li>
              )}
              {recentEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <p className="truncate text-sm font-semibold text-charcoal">{e.title}</p>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${e.status === "published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-800"}`}>
                      {e.status}
                    </span>
                    <span className="text-xs text-text-muted">{timeAgo(e.createdAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Right column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <aside className="rounded-2xl border border-border bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
            <h2 className="mb-4 font-heading text-base font-bold text-charcoal">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: "Manage Users", href: "/admin/users", desc: "Roles, status, history" },
                { label: "Review Events", href: "/admin/events", desc: "Feature, verify, moderate" },
                { label: "Approve Payouts", href: "/admin/payments", desc: "Pending organizer payouts" },
                { label: "Export Reports", href: "/admin/reports", desc: "CSV / Excel downloads" },
                { label: "System Settings", href: "/admin/settings", desc: "Fees, gateways, config" },
              ].map(({ label, href, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 transition hover:border-[#102442] hover:bg-[#f5f7ff]"
                >
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{label}</p>
                    <p className="text-xs text-text-secondary">{desc}</p>
                  </div>
                  <BarChart3 className="size-4 shrink-0 text-text-muted" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </aside>

          {/* Failed payments */}
          {failedPayments.length > 0 && (
            <aside className="rounded-2xl border border-red-200 bg-red-50 p-5">
              <h2 className="mb-3 font-heading text-base font-bold text-red-800">
                ⚠️ Failed Payments ({failedPayments.length})
              </h2>
              <ul className="space-y-2">
                {failedPayments.map((p) => (
                  <li key={p.id} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-xs text-red-700">{p.id.slice(0, 8)}…</span>
                    <span className="font-semibold text-red-800">ETB {Number(p.amount).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <Link href="/admin/payments" className="mt-3 inline-flex text-xs font-bold text-red-700 hover:underline">
                Resolve in Payments →
              </Link>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
