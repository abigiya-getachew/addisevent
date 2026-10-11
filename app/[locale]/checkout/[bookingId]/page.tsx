import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { CheckoutPaymentForm } from "@/components/dashboard/CheckoutPaymentForm";
import { db } from "@/lib/db";
import { bookings, events, ticketTiers } from "@/server/src/db/schema";
import { completeFreeBooking } from "@/app/[locale]/dashboard/user/actions";

export const metadata: Metadata = {
  title: "Checkout | AddisEvent",
};

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string; bookingId: string }>;
}) {
  const { locale, bookingId } = await params;
  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect(`/${locale}/auth/login`);

  const [booking] = await db
    .select({
      id: bookings.id,
      userId: bookings.userId,
      status: bookings.status,
      quantity: bookings.quantity,
      totalAmount: bookings.totalAmount,
      currency: bookings.currency,
      reservedUntil: bookings.reservedUntil,
      eventTitle: events.title,
      eventStart: events.startAt,
      venue: events.venue,
      tierName: ticketTiers.name,
    })
    .from(bookings)
    .innerJoin(events, eq(bookings.eventId, events.id))
    .innerJoin(ticketTiers, eq(bookings.tierId, ticketTiers.id))
    .where(and(eq(bookings.id, bookingId), eq(bookings.userId, user.id)))
    .limit(1);
  if (!booking) notFound();
  if (booking.status === "paid") redirect(`/${locale}/dashboard/user/tickets`);
  if (booking.status !== "reserved" && booking.status !== "pending") notFound();
  if (booking.reservedUntil && booking.reservedUntil <= new Date()) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-16">
        <section className="rounded-2xl border border-error/30 bg-white p-6 text-center">
          <h1 className="font-heading text-2xl font-bold text-charcoal">
            Your ticket reservation expired
          </h1>
          <p className="mt-2 text-sm text-text-secondary">
            Please return to your saved events and try booking again.
          </p>
        </section>
      </main>
    );
  }

  const amount = Number(booking.totalAmount);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:py-16">
      <header className="mb-7">
        <p className="text-sm font-semibold text-brand-red">Almost there</p>
        <h1 className="mt-1 font-heading text-2xl font-bold text-charcoal sm:text-3xl">
          Complete your booking
        </h1>
      </header>
      <section className="rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7">
        <h2 className="font-heading text-xl font-semibold text-charcoal">
          {booking.eventTitle}
        </h2>
        <p className="mt-2 text-sm text-text-secondary">
          {booking.tierName} · {booking.quantity}{" "}
          {booking.quantity === 1 ? "ticket" : "tickets"}
        </p>
        <p className="mt-1 text-sm text-text-secondary">
          {new Intl.DateTimeFormat(locale, {
            dateStyle: "full",
            timeStyle: "short",
            timeZone: "Africa/Addis_Ababa",
          }).format(booking.eventStart)}
          {booking.venue ? ` · ${booking.venue}` : ""}
        </p>
        <p className="mt-5 border-t border-border pt-5 font-heading text-2xl font-bold text-charcoal">
          {amount.toLocaleString(locale)} {booking.currency}
        </p>
        {amount === 0 ? (
          <form action={completeFreeBooking} className="mt-6">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="bookingId" value={booking.id} />
            <button
              type="submit"
              className="w-full rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c93630]"
            >
              Confirm free booking
            </button>
          </form>
        ) : (
          <CheckoutPaymentForm bookingId={booking.id} />
        )}
      </section>
      {booking.reservedUntil && (
        <p className="mt-4 text-center text-xs text-text-muted">
          This ticket is held until{" "}
          {new Intl.DateTimeFormat(locale, {
            timeStyle: "short",
            timeZone: "Africa/Addis_Ababa",
          }).format(booking.reservedUntil)}
          .
        </p>
      )}
    </main>
  );
}
