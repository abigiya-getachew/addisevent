import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Ticket as TicketIcon } from "lucide-react";
import { TicketActions } from "@/components/dashboard/TicketActions";

type TicketRecord = {
  id: string;
  ticketStatus: "issued" | "scanned" | "cancelled";
  bookingId: string;
  bookingStatus: "pending" | "reserved" | "paid" | "failed" | "expired" | "refunded";
  paymentMethod: "telebirr" | "cbebirr" | "chapa" | "pay_at_gate" | null;
  totalAmount: string;
  currency: string;
  eventId: string;
  eventTitle: string;
  eventImage: string | null;
  eventStart: Date;
  eventEnd: Date | null;
  venue: string | null;
  venueAddress: string | null;
  city: string;
  tierName: string;
  qrCode: string;
};

export function TicketCard({
  ticket,
  locale,
  showActions = true,
}: {
  ticket: TicketRecord;
  locale: string;
  showActions?: boolean;
}) {
  const location = ticket.venueAddress || ticket.city;
  const status = getTicketStatus(ticket, new Date());

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-(--shadow-1)">
      <div className="grid lg:grid-cols-[minmax(0,1fr)_220px]">
        <div className="min-w-0">
          <div className="grid sm:grid-cols-[180px_minmax(0,1fr)]">
            <div className="relative min-h-40 overflow-hidden bg-[#f1e8d9] sm:min-h-48">
              {ticket.eventImage ? (
                <Image
                  src={ticket.eventImage}
                  alt=""
                  fill
                  unoptimized
                  sizes="(min-width: 640px) 180px, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full min-h-40 items-center justify-center text-brand-red">
                  <TicketIcon aria-hidden="true" className="size-10" />
                </div>
              )}
              <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${status.classes}`}>
                {status.label}
              </span>
            </div>

            <div className="min-w-0 p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                {ticket.tierName}
              </p>
              <h2 className="mt-1 font-heading text-xl font-bold leading-tight text-charcoal">
                {ticket.eventTitle}
              </h2>
              <div className="mt-4 space-y-2 text-sm text-text-secondary">
                <p className="flex items-start gap-2">
                  <CalendarDays aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                  <time dateTime={ticket.eventStart.toISOString()}>
                    {formatEventDate(ticket.eventStart, locale)}
                  </time>
                </p>
                {ticket.venue && (
                  <p className="flex items-start gap-2">
                    <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                    <span>
                      {ticket.venue}
                      {location ? ` · ${location}` : ""}
                    </span>
                  </p>
                )}
              </div>
              <div className="mt-4 border-t border-border pt-3">
                <p className="text-xs font-medium text-text-muted">Ticket ID</p>
                <p className="mt-1 break-all font-mono text-xs text-charcoal">
                  {ticket.id}
                </p>
              </div>
              {showActions && (
                <div className="mt-4">
                  <TicketActions
                    locale={locale}
                    ticketId={ticket.id}
                    eventTitle={ticket.eventTitle}
                    startAt={ticket.eventStart.toISOString()}
                    endAt={ticket.eventEnd?.toISOString() ?? null}
                    venue={ticket.venue ?? ""}
                    location={location}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center border-t border-border bg-[#fbf9f5] p-5 text-center lg:border-l lg:border-t-0">
          {status.canScan ? (
            <>
              <Image
                src={ticket.qrCode}
                alt={`Entry QR code for ${ticket.eventTitle}`}
                width={172}
                height={172}
                unoptimized
                className="size-40 rounded-xl border border-border bg-white p-2"
              />
              <p className="mt-3 text-xs font-semibold text-charcoal">
                Show this code at entry
              </p>
              <p className="mt-1 text-xs text-text-muted">Keep it ready to scan</p>
            </>
          ) : (
            <div className="flex size-40 flex-col items-center justify-center rounded-xl border border-dashed border-border-strong bg-white p-4 text-text-muted">
              <TicketIcon aria-hidden="true" className="size-7" />
              <p className="mt-2 text-xs font-medium">
                {status.label === "Used" ? "Already checked in" : "Entry code unavailable"}
              </p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function getTicketStatus(ticket: TicketRecord, now: Date) {
  if (ticket.bookingStatus === "refunded") {
    return { label: "Refunded", classes: "bg-error-soft text-error", canScan: false };
  }
  if (ticket.ticketStatus === "cancelled") {
    return { label: "Cancelled", classes: "bg-error-soft text-error", canScan: false };
  }
  if (ticket.ticketStatus === "scanned") {
    return { label: "Used", classes: "bg-success-soft text-success", canScan: false };
  }
  if (ticket.bookingStatus !== "paid") {
    return { label: "Not confirmed", classes: "bg-warning-soft text-warning", canScan: false };
  }
  if (ticket.eventStart.getTime() > now.getTime()) {
    return { label: "Upcoming", classes: "bg-brand-secondary-soft text-brand-deep-blue", canScan: true };
  }
  return { label: "Valid", classes: "bg-success-soft text-success", canScan: true };
}

function formatEventDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  }).format(date);
}
