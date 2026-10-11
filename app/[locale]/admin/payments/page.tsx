import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, events, organizerPayouts, payments, users } from "@/server/src/db/schema";
import { AdminTable, PageHeader, StatCard, StatusBadge } from "@/components/admin/AdminUI";
import { CircleDollarSign, CreditCard, AlertTriangle, Clock } from "lucide-react";

export const metadata: Metadata = { title: "Payments & Payouts | AddisEvent" };

const STATUSES = ["all", "pending", "completed", "failed", "refunded"] as const;

export default async function AdminPaymentsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as (typeof STATUSES)[number]) ? sp.status as (typeof STATUSES)[number] : "all";

  const [kpis, txRows, payoutRows] = await Promise.all([
    db
      .select({
        totalCollected: sql<string>`coalesce(sum(${bookings.totalAmount}) filter (where ${bookings.status} = 'paid'), 0)`,
        pendingPayouts: sql<string>`coalesce(sum(${organizerPayouts.amount}) filter (where ${organizerPayouts.status} = 'processing'), 0)`,
        sentPayouts: sql<string>`coalesce(sum(${organizerPayouts.amount}) filter (where ${organizerPayouts.status} = 'sent'), 0)`,
        failedTx: sql<number>`count(${payments.id}) filter (where ${payments.status} = 'failed')`,
      })
      .from(bookings)
      .leftJoin(organizerPayouts, sql`true`)
      .leftJoin(payments, sql`true`)
      .then((r) => r[0])
      .catch(() => null),

    db
      .select({
        id: payments.id,
        amount: payments.amount,
        status: payments.status,
        gateway: payments.gateway,
        transactionId: payments.transactionId,
        createdAt: payments.createdAt,
        eventTitle: events.title,
      })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .innerJoin(events, eq(bookings.eventId, events.id))
      .where(status !== "all" ? eq(payments.status, status as "pending" | "completed" | "failed" | "refunded") : undefined)
      .orderBy(desc(payments.createdAt))
      .limit(30)
      .catch(() => []),

    db
      .select({
        id: organizerPayouts.id,
        amount: organizerPayouts.amount,
        status: organizerPayouts.status,
        referenceId: organizerPayouts.referenceId,
        createdAt: organizerPayouts.createdAt,
        organizerName: users.name,
      })
      .from(organizerPayouts)
      .leftJoin(users, eq(organizerPayouts.organizerId, users.id))
      .orderBy(desc(organizerPayouts.createdAt))
      .limit(20)
      .catch(() => []),
  ]);

  const totalCollected = Number(kpis?.totalCollected ?? 0);
  const platformFee = totalCollected * 0.05;

  const gatewayLabels: Record<string, string> = {
    telebirr: "Telebirr", cbebirr: "CBE Birr", chapa: "Chapa", pay_at_gate: "Gate",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Payments & Payouts" description="Financial oversight across all transactions." />

      <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Collected" value={`ETB ${totalCollected.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="All paid bookings" icon={CircleDollarSign} accent="bg-[#EFFAF5] text-[#1E8F60]" />
        <StatCard label="Platform Fees" value={`ETB ${platformFee.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="5% commission" icon={CreditCard} accent="bg-[#EEF2FF] text-[#102442]" />
        <StatCard label="Pending Payouts" value={`ETB ${Number(kpis?.pendingPayouts ?? 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} sub="Awaiting approval" icon={Clock} accent="bg-amber-50 text-amber-700" />
        <StatCard label="Failed Transactions" value={(kpis?.failedTx ?? 0).toString()} sub="Needs resolution" icon={AlertTriangle} accent="bg-red-50 text-red-600" />
      </section>

      {/* Transaction list */}
      <div className="mb-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-charcoal">Transactions</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((s) => (
              <Link key={s} href={`/admin/payments?status=${s}`}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${status === s ? "bg-[#102442] text-white" : "border border-border bg-white text-charcoal hover:border-[#102442]"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Link>
            ))}
          </div>
        </div>
        <AdminTable headers={["Reference", "Event", "Amount", "Gateway", "Status", "Date"]}>
          <>
            {txRows.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-text-secondary">No transactions found.</td></tr>
            )}
            {txRows.map((t) => (
              <tr key={t.id} className="border-b border-border/60 last:border-0 hover:bg-[#faf8f4]">
                <td className="px-5 py-3 font-mono text-xs text-text-secondary">{t.transactionId ?? t.id.slice(0, 12)}</td>
                <td className="px-5 py-3 text-sm text-charcoal">{t.eventTitle}</td>
                <td className="px-5 py-3 text-sm font-semibold text-charcoal">ETB {Number(t.amount).toLocaleString()}</td>
                <td className="px-5 py-3 text-sm text-text-secondary">{gatewayLabels[t.gateway] ?? t.gateway}</td>
                <td className="px-5 py-3"><StatusBadge status={t.status} /></td>
                <td className="px-5 py-3 text-xs text-text-muted">
                  {new Intl.DateTimeFormat("en-ET", { dateStyle: "short" }).format(t.createdAt)}
                </td>
              </tr>
            ))}
          </>
        </AdminTable>
      </div>

      {/* Payout management */}
      <div>
        <h2 className="mb-4 font-heading text-lg font-bold text-charcoal">Organizer Payouts</h2>
        <AdminTable headers={["Organizer", "Amount", "Status", "Reference", "Date"]}>
          <>
            {payoutRows.length === 0 && (
              <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-text-secondary">No payouts yet.</td></tr>
            )}
            {payoutRows.map((p) => (
              <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-[#faf8f4]">
                <td className="px-5 py-3 text-sm font-semibold text-charcoal">{p.organizerName ?? "—"}</td>
                <td className="px-5 py-3 text-sm font-semibold text-charcoal">ETB {Number(p.amount).toLocaleString()}</td>
                <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                <td className="px-5 py-3 font-mono text-xs text-text-muted">{p.referenceId ?? "—"}</td>
                <td className="px-5 py-3 text-xs text-text-muted">
                  {new Intl.DateTimeFormat("en-ET", { dateStyle: "short" }).format(p.createdAt)}
                </td>
              </tr>
            ))}
          </>
        </AdminTable>
      </div>
    </div>
  );
}
