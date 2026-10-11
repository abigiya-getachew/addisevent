import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, ReceiptText } from "lucide-react";
import { and, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { TicketCard } from "@/components/dashboard/TicketCard";
import { db } from "@/lib/db";
import { generateQRDataURL } from "@/server/src/utils/qr";
import { bookings, events, ticketTiers, tickets } from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "Ticket Details | AddisEvent",
};

export default async function UserTicketDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();
  const user = session?.user;

  if (!user?.id) redirect(`/${locale}/auth/login`);
  if (user.role === "organizer") redirect(`/${locale}/organizer`);
  if (user.role === "admin") redirect(`/${locale}/admin`);

  const [record] = await db
    .select({
      id: tickets.id,
      qrUuid: tickets.qrUuid,
      ticketStatus: tickets.status,
      bookingId: bookings.id,
      bookingStatus: bookings.status,
      paymentMethod: bookings.paymentMethod,
      totalAmount: bookings.totalAmount,
      currency: bookings.currency,
      eventId: events.id,
      eventTitle: events.title,
      eventImage: events.imageUrl,
      eventStart: events.startAt,
      eventEnd: events.endAt,
      venue: events.venue,
      venueAddress: events.venueAddress,
      city: events.city,
      tierName: ticketTiers.name,
    })
    .from(tickets)
    .innerJoin(bookings, eq(tickets.bookingId, bookings.id))
    .innerJoin(events, eq(bookings.eventId, events.id))
    .innerJoin(ticketTiers, eq(bookings.tierId, ticketTiers.id))
    .where(and(eq(tickets.id, id), eq(bookings.userId, user.id)))
    .limit(1);

  if (!record) notFound();

  const ticket = {
    ...record,
    qrCode: await generateQRDataURL(record.qrUuid),
  };

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
      <Link
        href={`/${locale}/dashboard/user/tickets`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-text-secondary transition hover:text-brand-red"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Back to my tickets
      </Link>
      <h1 className="mb-5 font-heading text-2xl font-bold text-charcoal sm:text-3xl">
        Ticket details
      </h1>
      <TicketCard ticket={ticket} locale={locale} showActions={false} />

      <section
        id="receipt"
        className="mt-6 rounded-2xl border border-border bg-white p-5 shadow-(--shadow-1) sm:p-7"
      >
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-brand-secondary-soft text-brand-deep-blue">
            <ReceiptText aria-hidden="true" className="size-5" />
          </span>
          <div>
            <h2 className="font-heading text-lg font-semibold text-charcoal">
              Booking receipt
            </h2>
            <p className="text-sm text-text-secondary">
              Receipt details for this ticket’s booking
            </p>
          </div>
        </div>
        <dl className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-xs font-medium text-text-muted">Booking reference</dt>
            <dd className="mt-1 break-all font-mono text-sm text-charcoal">
              {record.bookingId}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-muted">Payment status</dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-charcoal">
              {record.bookingStatus}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-muted">Amount paid for booking</dt>
            <dd className="mt-1 text-sm font-semibold text-charcoal">
              {Number(record.totalAmount).toLocaleString(locale)} {record.currency}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium text-text-muted">Payment method</dt>
            <dd className="mt-1 text-sm font-semibold capitalize text-charcoal">
              {record.paymentMethod?.replaceAll("_", " ") ?? "Not recorded"}
            </dd>
          </div>
        </dl>
      </section>
    </main>
  );
}
