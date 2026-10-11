import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/auth";
import { ProfileForms } from "@/components/dashboard/ProfileForms";
import { AccountDeletionForm } from "@/components/dashboard/AccountDeletionForm";
import { ReceiptDownloadButton } from "@/components/dashboard/ReceiptDownloadButton";
import { db } from "@/lib/db";
import { accounts, bookings, events, payments, users } from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "Profile & Settings | AddisEvent",
};

export default async function AttendeeProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user?.id) redirect(`/${locale}/auth/login`);
  if (user.role === "organizer") redirect(`/${locale}/organizer`);
  if (user.role === "admin") redirect(`/${locale}/admin`);

  const [[profile], socialAccounts, transactions] = await Promise.all([
    db
      .select({
        name: users.name,
        email: users.email,
        phone: users.phone,
        avatarUrl: users.avatarUrl,
        interests: users.interests,
        emailNotifications: users.emailNotifications,
        smsReminders: users.smsReminders,
        hasPassword: users.passwordHash,
      })
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1),
    db
      .select({ provider: accounts.provider })
      .from(accounts)
      .where(eq(accounts.userId, user.id)),
    db
      .select({
        id: payments.id,
        bookingId: bookings.id,
        eventTitle: events.title,
        amount: payments.amount,
        currency: payments.currency,
        status: payments.status,
        method: payments.gateway,
        date: payments.createdAt,
      })
      .from(payments)
      .innerJoin(bookings, eq(payments.bookingId, bookings.id))
      .innerJoin(events, eq(bookings.eventId, events.id))
      .where(eq(bookings.userId, user.id))
      .orderBy(desc(payments.createdAt))
      .limit(20),
  ]);

  if (!profile) redirect(`/${locale}/auth/login`);
  const paymentMethods = [...new Set(transactions.map((row) => row.method))];
  const profileValues = {
    name: profile.name ?? "",
    email: profile.email ?? "",
    phone: profile.phone ?? "",
    avatarUrl: profile.avatarUrl ?? "",
    interests: profile.interests ?? [],
    emailNotifications: profile.emailNotifications,
    smsReminders: profile.smsReminders,
    hasPassword: Boolean(profile.hasPassword),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 pb-28 sm:px-6 sm:py-10 md:pb-10">
      <header className="mb-8">
        <p className="text-sm font-semibold text-brand-red">Your account</p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          Profile &amp; settings
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your details, event preferences, notifications, and security.
        </p>
      </header>

      <ProfileForms locale={locale} profile={profileValues} />

      <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
        <h2 className="font-heading text-lg font-semibold text-charcoal">
          Payment methods
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Payment options used on your past bookings.
        </p>
        {paymentMethods.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="rounded-full border border-border px-3 py-2 text-sm font-medium capitalize text-charcoal"
              >
                {method.replaceAll("_", " ")}
              </span>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-[#f8f6f2] p-4 text-sm text-text-secondary">
            Payment options will appear here after your first transaction. Card details are not stored.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
        <h2 className="font-heading text-lg font-semibold text-charcoal">
          Connected accounts
        </h2>
        <p className="mt-1 text-sm text-text-secondary">
          Social providers linked to your AddisEvent sign-in.
        </p>
        {socialAccounts.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-2">
            {socialAccounts.map(({ provider }) => (
              <li
                key={provider}
                className="rounded-full bg-brand-secondary-soft px-3 py-2 text-sm font-semibold capitalize text-brand-deep-blue"
              >
                {provider}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-text-secondary">
            No social accounts are connected.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-heading text-lg font-semibold text-charcoal">
              Transaction history
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              Your latest payment records and downloadable receipts.
            </p>
          </div>
        </div>
        {transactions.length > 0 ? (
          <div className="mt-5 divide-y divide-border">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex flex-wrap items-center justify-between gap-3 py-4 first:pt-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-charcoal">
                    {transaction.eventTitle}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "Africa/Addis_Ababa",
                    }).format(transaction.date)}{" "}
                    · {transaction.status}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-charcoal">
                    {Number(transaction.amount).toLocaleString(locale)} {transaction.currency}
                  </span>
                  <ReceiptDownloadButton
                    receipt={{
                      reference: transaction.bookingId,
                      event: transaction.eventTitle,
                      amount: `${Number(transaction.amount).toLocaleString(locale)} ${transaction.currency}`,
                      date: transaction.date.toISOString(),
                      method: transaction.method.replaceAll("_", " "),
                      status: transaction.status,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-[#f8f6f2] p-4 text-sm text-text-secondary">
            Completed and pending payments will appear here.
          </p>
        )}
      </section>

      <section className="mt-6 rounded-2xl border border-error/30 bg-white p-5 sm:p-7">
        <h2 className="font-heading text-lg font-semibold text-error">
          Delete account
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary">
          Your profile and sign-in will be deleted. Bookings and receipts are retained for record-keeping, with your personal details removed. This cannot be undone.
        </p>
        <AccountDeletionForm locale={locale} />
      </section>
    </main>
  );
}
