import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { organizerPayoutAccounts, organizerPayouts, users } from "@/server/src/db/schema";
import { PayoutAccountForm } from "@/components/dashboard/PayoutAccountForm";
import { AccountSettingsForm } from "@/components/dashboard/AccountSettingsForm";

export const metadata: Metadata = { title: "Organizer Settings | AddisEvent" };

export default async function OrganizerSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);

  const [[payoutAccount], payoutHistory, [user]] = await Promise.all([
    db
      .select()
      .from(organizerPayoutAccounts)
      .where(eq(organizerPayoutAccounts.userId, session.user.id))
      .limit(1)
      .catch(() => []),
    db
      .select()
      .from(organizerPayouts)
      .where(eq(organizerPayouts.organizerId, session.user.id))
      .orderBy(sql`${organizerPayouts.createdAt} desc`)
      .limit(20)
      .catch(() => []),
    db
      .select({ name: users.name, phone: users.phone, email: users.email, locale: users.locale })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)
      .catch(() => []),
  ]);

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="font-heading text-3xl font-bold text-charcoal">Payouts & Settings</h1>
      <p className="mt-1 mb-10 text-sm text-text-secondary">Manage your payout account and profile.</p>

      {/* Payout Account */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-charcoal">Payout Account</h2>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          {payoutAccount?.isVerified && (
            <div className="mb-4 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200">
              ✓ Verified — {payoutAccount.method === "telebirr" ? "Telebirr" : payoutAccount.method === "cbebirr" ? "CBE Birr" : "Bank Transfer"} · {payoutAccount.accountNumber}
            </div>
          )}
          <PayoutAccountForm existing={payoutAccount ?? null} />
        </div>
      </section>

      {/* Payout History */}
      <section className="mb-10">
        <h2 className="mb-4 font-heading text-xl font-bold text-charcoal">Payout History</h2>
        <div className="rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          {payoutHistory.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-text-secondary">No payouts yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-text-muted">
                    <th className="px-5 py-3">Date</th>
                    <th className="px-5 py-3">Amount</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Reference</th>
                  </tr>
                </thead>
                <tbody>
                  {payoutHistory.map((p) => (
                    <tr key={p.id} className="border-b border-border/60 last:border-0">
                      <td className="px-5 py-3 text-text-secondary">
                        {new Intl.DateTimeFormat("en-ET", { dateStyle: "medium" }).format(p.createdAt)}
                      </td>
                      <td className="px-5 py-3 font-semibold text-charcoal">ETB {Number(p.amount).toLocaleString()}</td>
                      <td className="px-5 py-3">
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
                      <td className="px-5 py-3 font-mono text-xs text-text-secondary">{p.referenceId ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Account Settings */}
      <section>
        <h2 className="mb-4 font-heading text-xl font-bold text-charcoal">Account Settings</h2>
        <div className="rounded-2xl border border-border bg-white p-6 shadow-[0_8px_24px_rgba(15,23,42,0.03)]">
          <AccountSettingsForm user={user ?? null} />
        </div>
      </section>
    </main>
  );
}
