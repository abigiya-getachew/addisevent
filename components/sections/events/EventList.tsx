"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowRight,
  CalendarX2,
  CalendarDays,
  ChevronDown,
  MapPin,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { EventCard, type EventListItem } from "./EventCard";
import { EVENTS } from "../../../lib/data/event-data";

const PAGE_SIZE = 7;

type SortOrder = "recommended" | "date" | "price-low" | "price-high";

export function EventList({
  events = EVENTS,
  locale = "en",
}: {
  events?: EventListItem[];
  locale?: string;
}) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("recommended");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const sortedEvents = useMemo(() => {
    const items = [...events];

    switch (sortOrder) {
      case "date":
        return items.sort(
          (first, second) =>
            new Date(first.dateTime).getTime() - new Date(second.dateTime).getTime(),
        );
      case "price-low":
        return items.sort((first, second) => first.price - second.price);
      case "price-high":
        return items.sort((first, second) => second.price - first.price);
      default:
        return items;
    }
  }, [events, sortOrder]);

  const visibleEvents = sortedEvents.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [events, sortOrder]);

  return (
    <section
      aria-labelledby="event-list-heading"
      className="px-4 pb-20 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-7 flex flex-col gap-5 border-b border-[#e7dfd1] pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
              <Sparkles aria-hidden="true" className="size-3.5 text-brand-gold" />
              Your city, your next story
            </p>
            <h2
              id="event-list-heading"
              className="mt-2 font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
            >
              Find your kind of <span className="text-brand-red">wonder.</span>
            </h2>
            <p aria-live="polite" className="mt-2 text-sm text-text-secondary sm:text-base">
              {events.length} {events.length === 1 ? "experience" : "experiences"} to make
              the most of Addis Ababa
            </p>
          </div>

          <label className="flex items-center gap-3 self-start whitespace-nowrap rounded-xl border border-[#e7dfd1] bg-white px-3.5 py-2.5 text-sm text-charcoal shadow-[0_4px_16px_rgba(42,42,42,0.05)] transition focus-within:border-brand-gold sm:self-auto">
            <ArrowDownWideNarrow
              aria-hidden="true"
              className="size-4 text-brand-red"
            />
            <span className="font-medium">Sort by</span>
            <span className="relative">
              <select
                aria-label="Sort events"
                value={sortOrder}
                onChange={(event) => setSortOrder(event.target.value as SortOrder)}
                className="cursor-pointer appearance-none bg-transparent pr-5 font-semibold outline-none focus-visible:text-brand-red"
              >
                <option value="recommended">Recommended</option>
                <option value="date">Soonest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
              <ChevronDown
                aria-hidden="true"
                className="pointer-events-none absolute right-0 top-1/2 size-4 -translate-y-1/2 text-text-muted"
              />
            </span>
          </label>
        </div>

        {visibleEvents.length > 0 ? (
          <>
            <SpotlightCard
              event={visibleEvents[0]}
              href={`/${locale}/events/${visibleEvents[0].id}`}
            />
            {visibleEvents.length > 1 && (
              <div className="mt-10">
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand-red">
                      Keep exploring
                    </p>
                    <h3 className="mt-1 font-heading text-xl font-bold text-charcoal sm:text-2xl">
                      More happening in Addis
                    </h3>
                  </div>
                  <span className="hidden text-sm font-medium text-text-muted sm:block">
                    {visibleEvents.length - 1} events
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                  {visibleEvents.slice(1).map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  href={`/${locale}/events/${event.id}`}
                />
                  ))}
                </div>
              </div>
            )}

            {visibleCount < sortedEvents.length && (
              <div className="mt-10 text-center">
                <button
                  type="button"
                  onClick={() =>
                    setVisibleCount((count) =>
                      Math.min(count + PAGE_SIZE, sortedEvents.length),
                    )
                  }
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-brand-red px-7 py-3 text-sm font-bold text-brand-red transition hover:bg-brand-red hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
                >
                  Load more events
                  <span className="sr-only">
                    , {sortedEvents.length - visibleCount} remaining
                  </span>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-[2rem] border border-[#e8dfcf] bg-white px-6 py-14 text-center shadow-[0_16px_40px_rgba(42,42,42,0.05)] sm:py-20">
            <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#f8eee0] text-brand-red">
              <CalendarX2 aria-hidden="true" className="size-6" />
            </span>
            <h3 className="mt-5 font-heading text-xl font-bold text-charcoal">
              No events match those filters
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-text-secondary">
              Try a different search or clear your filters to discover more
              happening around Addis Ababa.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default EventList;

function SpotlightCard({
  event,
  href,
}: {
  event: EventListItem;
  href: string;
}) {
  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-[#e8dfd1] bg-white shadow-[0_18px_48px_rgba(42,42,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_58px_rgba(42,42,42,0.13)]">
      <Link
        href={href}
        aria-label={`Book ${event.title}`}
        className="grid h-full lg:grid-cols-[1.05fr_0.95fr]"
      >
        <div className="relative min-h-64 overflow-hidden bg-[#e9dfd0] sm:min-h-80 lg:min-h-[390px]">
          <Image
            src={event.image}
            alt=""
            fill
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="object-cover transition duration-700 group-hover:scale-[1.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/55 via-transparent to-charcoal/10 lg:bg-gradient-to-r lg:from-transparent lg:via-transparent lg:to-charcoal/10" />
          <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/90 px-3.5 py-2 text-xs font-bold uppercase tracking-[0.12em] text-charcoal shadow-sm backdrop-blur-md">
            <Sparkles aria-hidden="true" className="size-3.5 text-brand-red" />
            Featured experience
          </span>
          <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl border border-white/40 bg-white/95 p-3 shadow-lg backdrop-blur-md">
            <span className="grid size-12 place-items-center rounded-xl bg-[#fbf1e3] text-center">
              <span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-brand-red">
                  {new Intl.DateTimeFormat("en", {
                    month: "short",
                    timeZone: "Africa/Addis_Ababa",
                  }).format(new Date(event.dateTime))}
                </span>
                <strong className="block font-heading text-lg leading-5 text-charcoal">
                  {new Intl.DateTimeFormat("en", {
                    day: "2-digit",
                    timeZone: "Africa/Addis_Ababa",
                  }).format(new Date(event.dateTime))}
                </strong>
              </span>
            </span>
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.12em] text-text-muted">
                Coming up
              </span>
              <span className="mt-0.5 block text-sm font-semibold text-charcoal">
                {event.date.split("·")[0].trim()}
              </span>
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <span className="w-fit rounded-full bg-[#fbf1e3] px-3 py-1.5 text-xs font-bold text-[#8a611e]">
            {event.category}
          </span>
          <h3 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight text-charcoal transition-colors group-hover:text-brand-red sm:text-4xl">
            {event.title}
          </h3>
          <p className="mt-3 line-clamp-3 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            {event.description ??
              "Discover a special local experience, meet your people, and make a memory in Addis Ababa."}
          </p>
          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-text-secondary">
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4 text-brand-gold" />
              {event.date.split("·").slice(1).join("·").trim() || event.date}
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
              {event.venue}
            </span>
          </div>
          <div className="mt-7 flex items-center justify-between gap-4 border-t border-[#eee8dd] pt-5">
            <span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.14em] text-text-muted">
                Tickets from
              </span>
              <strong className="mt-1 block font-heading text-xl text-charcoal">
                {event.price === 0
                  ? "Free"
                  : `${event.price.toLocaleString()} ETB`}
              </strong>
            </span>
            <span className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand-red px-5 py-3 text-sm font-bold text-white shadow-[0_8px_18px_rgba(224,64,56,0.22)] transition group-hover:bg-[#c93630] group-hover:shadow-[0_10px_22px_rgba(224,64,56,0.3)]">
              Book Now
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}