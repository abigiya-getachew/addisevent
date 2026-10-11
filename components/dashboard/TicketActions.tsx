"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarPlus, Check, ReceiptText, Share2 } from "lucide-react";

type TicketActionsProps = {
  locale: string;
  ticketId: string;
  eventTitle: string;
  startAt: string;
  endAt: string | null;
  venue: string;
  location: string;
};

export function TicketActions({
  locale,
  ticketId,
  eventTitle,
  startAt,
  endAt,
  venue,
  location,
}: TicketActionsProps) {
  const [copied, setCopied] = useState(false);
  const detailHref = `/${locale}/dashboard/user/tickets/${ticketId}`;

  async function shareTicket() {
    const url = new URL(detailHref, window.location.origin).toString();
    const shareData = {
      title: `Ticket: ${eventTitle}`,
      text: `My ticket for ${eventTitle}`,
      url,
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      await navigator.share(shareData);
      return;
    }

    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function addToCalendar() {
    const start = toCalendarDate(startAt);
    const end = toCalendarDate(
      endAt ?? new Date(new Date(startAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    );
    const content = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AddisEvent//Tickets//EN",
      "BEGIN:VEVENT",
      `UID:${ticketId}@addisevent`,
      `DTSTAMP:${toCalendarDate(new Date().toISOString())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeCalendarText(eventTitle)}`,
      `LOCATION:${escapeCalendarText([venue, location].filter(Boolean).join(", "))}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const downloadUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = downloadUrl;
    anchor.download = `${eventTitle.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "event"}.ics`;
    anchor.click();
    URL.revokeObjectURL(downloadUrl);
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={detailHref}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c93630]"
      >
        View details
      </Link>
      <button
        type="button"
        onClick={addToCalendar}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
      >
        <CalendarPlus aria-hidden="true" className="size-4" />
        <span className="sr-only sm:not-sr-only">Add to calendar</span>
      </button>
      <button
        type="button"
        onClick={shareTicket}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
      >
        {copied ? (
          <Check aria-hidden="true" className="size-4 text-success" />
        ) : (
          <Share2 aria-hidden="true" className="size-4" />
        )}
        <span className="sr-only sm:not-sr-only">
          {copied ? "Link copied" : "Share ticket"}
        </span>
      </button>
      <Link
        href={`${detailHref}#receipt`}
        className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
      >
        <ReceiptText aria-hidden="true" className="size-4" />
        <span className="sr-only sm:not-sr-only">View receipt</span>
      </Link>
      <span className="sr-only" aria-live="polite">
        {copied ? "Ticket link copied to clipboard." : ""}
      </span>
    </div>
  );
}

function toCalendarDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeCalendarText(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}
