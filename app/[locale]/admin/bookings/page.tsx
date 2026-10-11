import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, events, ticketTiers, users } from "@/server/src/db/schema";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "Bookings & Tickets | AddisEvent" };

const STATUSES = ["all", "pending", "reserved", "paid", "refunded", "failed", "expired"] as const;
const METHODS = ["all", "telebirr", "cbebirr", "chapa", "pay_at_gate"] as const;

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; method?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const status = STATUSES.includes(sp.status as (typeof STATUSES)[number]) ? sp.status as (typeof STATUSES)[number] : "all";
  const method = METHODS.includes(sp.method as (typeof METHODS)[number]) ? sp.method as (typeof METHODS)[number] : "all";
  const q = sp.q?.trim() ?? "";

  const rows = await db
    .select({
      id: bookings.id,
      quantity: bookings.quantity,
      totalAmount: bookings.totalAmount,
      status: bookings.status,
      paymentMethod: bookings.paymentMethod,
      createdAt: bookings.createdAt,
      guestName: bookings.guestName,
      guestPhone: bookings.guestPhone,
      userName: users.name,
      userPhone: users.phone,
      eventTitle: events.title,
      tierName: ticketTiers.name,
    })
    .from(bookings)
    .leftJoin(users, eq(bookings.userId, users.id))
    .innerJoin(events, eq(bookings.eventId, events.id))
    .innerJoin(ticketTiers, eq(bookings.tierId, ticketTiers.id))
    .where(
      and(
        status !== "all" ? eq(bookings.status, status as "pending" | "reserved" | "paid" | "failed" | "expired" | "refunded") : undefined,
        method !== "all" ? eq(bookings.paymentMethod, method as "telebirr" | "cbebirr" | "chapa" | "pay_at_gate") : undefined,
        q ? or(ilike(events.title, `%${q}%`), ilike(users.phone, `%${q}%`), ilike(bookings.id, `%${q}%`)) : undefined,
      ),
    )
    .orderBy(desc(bookings.createdAt))
    .limit(50)
    .catch(() => []);

  function buildHref(overrides: Record<string, string>) {
    const params = new URLSearchParams({ status, method, ...(q ? { q } : {}), ...overrides });
    return `/admin/bookings?${params}`;
  }

  const methodLabels: Record<string, string> = {
    all: "All", telebirr: "Telebirr", cbebirr: "CBE Birr", chapa: "Chapa", pay_at_gate: "Gate",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="Bookings & Tickets" description="Every transaction across the platform." />

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
            {METHODS.map((m) => (
              <Link key={m} href={buildHref({ method: m })}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition ${method === m ? "bg-brand-gold text-charcoal" : "border border-border bg-white text-charcoal hover:border-brand-gold"}`}>
                {methodLabels[m]}
              </Link>
            ))}
          </div>
          <form method="GET" action="/admin/bookings" className="ml-auto flex gap-2">
            <input type="hidden" name="status" value={status} />
            <input type="hidden" name="method" value={method} />
            <input name="q" defaultValue={q} placeholder="Booking ID, phone, event…"
              className="h-9 w-56 rounded-full border border-border bg-white px-4 text-sm focus:border-[#102442] focus:outline-none" />
          </form>
        </div>
      </div>

      <AdminTable headers={["Buyer", "Event / Tier", "Qty", "Amount", "Method", "Status", "Date"]}>
        <>
          {rows.length === 0 && (
            <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-text-secondary">No bookings found.</td></tr>
          )}
          {rows.map((b) => (
            <tr key={b.id} className="border-b border-border/60 last:border-0 hover:bg-[#faf8f4]">
              <td className="px-5 py-3">
                <p className="font-semibold text-charcoal">{b.userName ?? b.guestName ?? "Guest"}</p>
                <p className="font-mono text-xs text-text-muted">{b.userPhone ?? b.guestPhone ?? b.id.slice(0, 8)}</p>
              </td>
              <td className="px-5 py-3">
                <p className="text-sm text-charcoal">{b.eventTitle}</p>
                <p className="text-xs text-text-secondary">{b.tierName}</p>
              </td>
              <td className="px-5 py-3 text-sm text-charcoal">{b.quantity}</td>
              <td className="px-5 py-3 text-sm font-semibold text-charcoal">ETB {Number(b.totalAmount).toLocaleString()}</td>
              <td className="px-5 py-3 text-sm text-text-secondary">{b.paymentMethod ? methodLabels[b.paymentMethod] : "—"}</td>
              <td className="px-5 py-3"><StatusBadge status={b.status} /></td>
              <td className="px-5 py-3 text-xs text-text-muted">
                {new Intl.DateTimeFormat("en-ET", { dateStyle: "short" }).format(b.createdAt)}
              </td>
            </tr>
          ))}
        </>
      </AdminTable>
    </div>
  );
}
