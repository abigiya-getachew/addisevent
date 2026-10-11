"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarPlus, CalendarSync, Check, Clock3, MapPin, Share2, Ticket } from "lucide-react";

type UpcomingEventCardProps = {
  locale: string;
  event: {
    id: string;
    ticketId: string | null;
    title: string;
    imageUrl: string | null;
    startAt: string;
    endAt: string | null;
    venue: string | null;
    venueAddress: string | null;
    city: string;
  };
};

export function UpcomingEventCard({ locale, event }: UpcomingEventCardProps) {
  const [now, setNow] = useState<number | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const eventUrl = `/${locale}/events/${event.id}`;
  const location = [event.venue, event.venueAddress || event.city]
    .filter(Boolean)
    .join(" · ");

  useEffect(() => {
    const updateCountdown = () => setNow(Date.now());
    updateCountdown();
    const interval = window.setInterval(updateCountdown, 60_000);
    return () => window.clearInterval(interval);
  }, []);

  async function shareEvent() {
    const url = new URL(eventUrl, window.location.origin).toString();
    const shareData = {
      title: event.title,
      text: `Join me at ${event.title}`,
      url,
    };

    if (navigator.share && (!navigator.canShare || navigator.canShare(shareData))) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
        throw error;
      }
      return;
    }

    await navigator.clipboard.writeText(url);
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 2000);
  }

  function downloadCalendar(reminder: boolean) {
    const start = calendarDate(event.startAt);
    const end = calendarDate(
      event.endAt ?? new Date(new Date(event.startAt).getTime() + 2 * 60 * 60 * 1000).toISOString(),
    );
    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//AddisEvent//Upcoming Events//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@addisevent`,
      `DTSTAMP:${calendarDate(new Date().toISOString())}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${escapeCalendarText(event.title)}`,
      `LOCATION:${escapeCalendarText(location)}`,
    ];

    if (reminder) {
      lines.push(
        "BEGIN:VALARM",
        "ACTION:DISPLAY",
        `DESCRIPTION:${escapeCalendarText(`Reminder: ${event.title} starts in 1 hour`)}`,
        "TRIGGER:-PT1H",
        "END:VALARM",
      );
    }

    lines.push("END:VEVENT", "END:VCALENDAR");
    const blob = new Blob([lines.join("\r\n")], {
      type: "text/calendar;charset=utf-8",
    });
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl;
    anchor.download = `${event.title.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "") || "event"}${reminder ? "-reminder" : ""}.ics`;
    anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
  }

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-white shadow-(--shadow-1)">
      <div className="grid sm:grid-cols-[200px_minmax(0,1fr)]">
        <div className="relative min-h-44 overflow-hidden bg-[#f1e8d9] sm:min-h-full">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt=""
              fill
              unoptimized
              sizes="(min-width: 640px) 200px, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex min-h-44 items-center justify-center text-brand-red">
              <CalendarSync aria-hidden="true" className="size-10" />
            </div>
          )}
        </div>

        <div className="min-w-0 p-5 sm:p-6">
          {now === null ? (
            <p className="inline-flex min-h-9 items-center gap-2 rounded-full bg-brand-secondary-soft px-3 py-2 text-sm font-semibold text-brand-deep-blue">
              <Clock3 aria-hidden="true" className="size-4" />
              Upcoming
            </p>
          ) : (
            <p
              aria-live="polite"
              className="inline-flex min-h-9 items-center gap-2 rounded-full bg-brand-secondary-soft px-3 py-2 text-sm font-semibold text-brand-deep-blue"
            >
              <Clock3 aria-hidden="true" className="size-4" />
              {formatCountdown(new Date(event.startAt).getTime() - now)}
            </p>
          )}

          <h2 className="mt-3 font-heading text-xl font-bold leading-tight text-charcoal sm:text-2xl">
            <Link href={eventUrl} className="transition hover:text-brand-red">
              {event.title}
            </Link>
          </h2>
          <div className="mt-3 space-y-2 text-sm text-text-secondary">
            <p className="flex items-start gap-2">
              <CalendarPlus aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" />
              <time dateTime={event.startAt}>
                {formatEventDate(new Date(event.startAt), locale)}
              </time>
            </p>
            {location && (
              <p className="flex items-start gap-2">
                <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand-gold" />
                {location}
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-4">
            <Link
              href={
                event.ticketId
                  ? `/${locale}/dashboard/user/tickets/${event.ticketId}`
                  : `/${locale}/dashboard/user/tickets`
              }
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c93630]"
            >
              <Ticket aria-hidden="true" className="size-4" />
              View ticket
            </Link>
            <button
              type="button"
              onClick={() => downloadCalendar(false)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
            >
              <CalendarPlus aria-hidden="true" className="size-4" />
              <span className="sr-only sm:not-sr-only">Add to calendar</span>
            </button>
            <button
              type="button"
              onClick={() => downloadCalendar(true)}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
            >
              <CalendarSync aria-hidden="true" className="size-4" />
              <span className="sr-only sm:not-sr-only">Set 1-hour reminder</span>
            </button>
            <button
              type="button"
              onClick={shareEvent}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold hover:bg-[#fbf9f5]"
            >
              {shareState === "copied" ? (
                <Check aria-hidden="true" className="size-4 text-success" />
              ) : (
                <Share2 aria-hidden="true" className="size-4" />
              )}
              <span className="sr-only sm:not-sr-only">
                {shareState === "copied" ? "Link copied" : "Share"}
              </span>
            </button>
            <span className="sr-only" aria-live="polite">
              {shareState === "copied" ? "Event link copied to clipboard." : ""}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatCountdown(milliseconds: number) {
  const totalHours = Math.max(0, Math.floor(milliseconds / 3_600_000));
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0 && hours === 0) {
    const minutes = Math.max(1, Math.floor(milliseconds / 60_000));
    return milliseconds <= 0 ? "Starting now" : `${minutes} ${minutes === 1 ? "minute" : "minutes"} to go`;
  }
  if (days === 0) return `${hours} ${hours === 1 ? "hour" : "hours"} to go`;
  return `${days} ${days === 1 ? "day" : "days"}, ${hours} ${hours === 1 ? "hour" : "hours"} to go`;
}

function formatEventDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  }).format(date);
}

function calendarDate(value: string) {
  return new Date(value).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function escapeCalendarText(value: string) {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}
