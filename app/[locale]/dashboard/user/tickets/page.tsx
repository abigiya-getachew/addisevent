import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Ticket as TicketIcon } from "lucide-react";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/auth";
import { TicketCard } from "@/components/dashboard/TicketCard";
import { db } from "@/lib/db";
import { generateQRDataURL } from "@/server/src/utils/qr";
import { bookings, events, ticketTiers, tickets } from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "My Tickets | AddisEvent",
};

export default async function UserTicketsPage({
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

  const records = await db
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
    .where(eq(bookings.userId, user.id))
    .orderBy(desc(events.startAt), desc(tickets.issuedAt));

  const ticketCards = await Promise.all(
    records.map(async (ticket) => ({
      ...ticket,
      qrCode: await generateQRDataURL(ticket.qrUuid),
    })),
  );

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold text-brand-red">Your entry passes</p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          My tickets
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Keep your QR code ready to scan when you arrive.
        </p>
      </header>

      {ticketCards.length > 0 ? (
        <div className="space-y-5">
          {ticketCards.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} locale={locale} />
          ))}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-primary-soft text-brand-red">
            <TicketIcon aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-5 font-heading text-xl font-semibold text-charcoal">
            No tickets yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
            Once you book an event, your tickets and entry QR codes will be here.
          </p>
          <Link
            href={`/${locale}/events`}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#c93630]"
          >
            Explore events <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </section>
      )}
    </main>
  );
}
