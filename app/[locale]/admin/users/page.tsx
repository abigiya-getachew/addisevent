import type { Metadata } from "next";
import Link from "next/link";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { bookings, events, users } from "@/server/src/db/schema";
import { AdminTable, PageHeader, StatusBadge } from "@/components/admin/AdminUI";

export const metadata: Metadata = { title: "User Management | AddisEvent" };

const ROLES = ["all", "attendee", "organizer", "admin"] as const;

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const role = ROLES.includes(sp.role as (typeof ROLES)[number]) ? sp.role as (typeof ROLES)[number] : "all";
  const q = sp.q?.trim() ?? "";

  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      phone: users.phone,
      role: users.role,
      createdAt: users.createdAt,
      bookingCount: sql<number>`count(distinct ${bookings.id})`,
      eventCount: sql<number>`count(distinct ${events.id})`,
    })
    .from(users)
    .leftJoin(bookings, eq(bookings.userId, users.id))
    .leftJoin(events, eq(events.organizerId, users.id))
    .where(
      and(
        role !== "all" ? eq(users.role, role as "attendee" | "organizer" | "admin") : undefined,
        q ? or(ilike(users.name, `%${q}%`), ilike(users.email, `%${q}%`), ilike(users.phone, `%${q}%`)) : undefined,
      ),
    )
    .groupBy(users.id)
    .orderBy(desc(users.createdAt))
    .limit(50)
    .catch(() => []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader title="User Management" description="All accounts on the platform." />

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {ROLES.map((r) => (
            <Link
              key={r}
              href={`/admin/users?role=${r}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${role === r ? "bg-[#102442] text-white" : "border border-border bg-white text-charcoal hover:border-[#102442]"}`}
            >
              {r.charAt(0).toUpperCase() + r.slice(1)}
            </Link>
          ))}
        </div>
        <form method="GET" action="/admin/users" className="flex gap-2">
          {role !== "all" && <input type="hidden" name="role" value={role} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, email, phone…"
            className="h-10 w-64 rounded-full border border-border bg-white px-4 text-sm focus:border-[#102442] focus:outline-none"
          />
        </form>
      </div>

      <AdminTable headers={["User", "Role", "Joined", "Bookings", "Events", "Actions"]}>
        <>
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-5 py-10 text-center text-sm text-text-secondary">No users found.</td>
            </tr>
          )}
          {rows.map((u) => (
            <tr key={u.id} className="border-b border-border/60 last:border-0 hover:bg-[#faf8f4]">
              <td className="px-5 py-3">
                <p className="font-semibold text-charcoal">{u.name ?? "—"}</p>
                <p className="text-xs text-text-secondary">{u.email ?? u.phone ?? "—"}</p>
              </td>
              <td className="px-5 py-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${u.role === "admin" ? "bg-red-50 text-red-700 ring-1 ring-red-200" : u.role === "organizer" ? "bg-[#EEF2FF] text-[#102442] ring-1 ring-[#102442]/20" : "bg-soft-stone text-text-secondary"}`}>
                  {u.role}
                </span>
              </td>
              <td className="px-5 py-3 text-sm text-text-secondary">
                {new Intl.DateTimeFormat("en-ET", { dateStyle: "medium" }).format(u.createdAt)}
              </td>
              <td className="px-5 py-3 text-sm text-charcoal">{u.bookingCount}</td>
              <td className="px-5 py-3 text-sm text-charcoal">{u.eventCount}</td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <Link href={`/admin/users/${u.id}`} className="rounded-lg border border-border px-3 py-1 text-xs font-semibold text-charcoal transition hover:border-[#102442]">
                    View
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
