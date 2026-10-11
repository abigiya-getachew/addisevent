import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Pencil,
  Ticket,
} from "lucide-react";
import { EventMoreActions } from "./EventMoreActions";
import { ShareEventButton } from "./ShareEventButton";

export type OrganizerEventListItem = {
  id: string;
  title: string;
  imageUrl: string | null;
  startAt: Date;
  venue: string | null;
  venueAddress: string | null;
  city: string;
  status: "draft" | "published" | "completed" | "cancelled";
  totalCapacity: number;
  ticketsSold: number;
  revenue: string;
};

const statusStyles: Record<OrganizerEventListItem["status"], string> = {
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft: "bg-amber-50 text-amber-800 ring-amber-200",
  completed: "bg-zinc-100 text-zinc-700 ring-zinc-200",
  cancelled: "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels: Record<OrganizerEventListItem["status"], string> = {
  published: "Published",
  draft: "Draft",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function OrganizerEventList({
  locale,
  events,
}: {
  locale: string;
  events: OrganizerEventListItem[];
}) {
  return (
    <div className="space-y-4">
      {events.map((event) => {
        const eventPath = `/${locale}/organizer/events/${event.id}`;
        const date = new Intl.DateTimeFormat(locale === "am" ? "am-ET" : "en-ET", {
          dateStyle: "medium",
          timeStyle: "short",
        }).format(event.startAt);

        return (
          <article
            key={event.id}
            className="overflow-hidden rounded-2xl border border-border bg-white shadow-[0_8px_24px_rgba(15,23,42,0.03)]"
          >
            <div className="grid gap-0 sm:grid-cols-[220px_minmax(0,1fr)]">
              <div
                className="min-h-44 bg-[#f7e9cd] bg-cover bg-center sm:min-h-full"
                style={event.imageUrl ? { backgroundImage: `url("${event.imageUrl}")` } : undefined}
                role="img"
                aria-label={event.imageUrl ? `${event.title} event image` : ""}
              >
                {!event.imageUrl && (
                  <div className="flex h-full min-h-44 items-center justify-center bg-[linear-gradient(135deg,#ffe7d6_0%,#f7e9cd_100%)] font-heading text-lg font-bold text-[#7a4b16]">
                    AddisEvent
                  </div>
                )}
              </div>

              <div className="min-w-0 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-heading text-xl font-bold text-charcoal sm:text-2xl">
                        {event.title}
                      </h2>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${statusStyles[event.status]}`}
                      >
                        {statusLabels[event.status]}
                      </span>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-text-secondary">
                      <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                      {date}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-text-secondary">
                      <MapPin className="size-4 shrink-0" aria-hidden="true" />
                      {[event.venue, event.venueAddress, event.city].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <EventMoreActions eventId={event.id} status={event.status} />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 rounded-xl bg-[#faf8f4] px-4 py-3 text-sm">
                  <span className="inline-flex items-center gap-2 text-charcoal">
                    <Ticket className="size-4 text-brand-red" aria-hidden="true" />
                    <strong>{event.ticketsSold}</strong>
                    <span className="text-text-secondary">tickets sold / {event.totalCapacity} capacity</span>
                  </span>
                  <span className="font-semibold text-charcoal">
                    ETB {Number(event.revenue).toLocaleString(locale === "am" ? "am-ET" : "en-ET")}
                    <span className="ml-1 font-normal text-text-secondary">revenue</span>
                  </span>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/${locale}/events/${event.id}`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full bg-brand-red px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#c93630]"
                  >
                    View
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </Link>
                  <Link
                    href={`${eventPath}/edit`}
                    className="inline-flex min-h-10 items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold"
                  >
                    <Pencil className="size-4" aria-hidden="true" />
                    Edit
                  </Link>
                  <Link
                    href={eventPath}
                    className="inline-flex min-h-10 items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-charcoal transition hover:border-brand-gold"
                  >
                    Stats
                  </Link>
                  <ShareEventButton path={`/${locale}/events/${event.id}`} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
