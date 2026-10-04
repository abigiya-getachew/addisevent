"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Coffee,
  Drama,
  MapPin,
  Mic2,
  Mountain,
  Sparkles,
} from "lucide-react";

const events = [
  {
    title: "Sunset Concert",
    venue: "Meskel Square",
    date: "Oct 10",
    dateTime: "2026-10-10",
    time: "6:00 PM",
    month: "OCT",
    day: "10",
    price: "200",
    priceLabel: "FROM",
    category: "Live music",
    action: "Book Now",
    Icon: Mic2,
    image: "/images/hero_event_concert_1791041390305.jpg",
    theme: "concert",
  },
  {
    title: "Cultural Festival",
    venue: "Piassa",
    date: "Oct 12",
    dateTime: "2026-10-12",
    time: "All day",
    month: "OCT",
    day: "12",
    price: "FREE",
    priceLabel: "ENTRY",
    category: "Culture",
    action: "Get Ticket",
    Icon: Drama,
    image: "/images/hero_event_festival_1791041403567.jpg",
    theme: "festival",
  },
  {
    title: "Art & Coffee Workshop",
    venue: "Bole",
    date: "Oct 14",
    dateTime: "2026-10-14",
    time: "2:00 PM",
    month: "OCT",
    day: "14",
    price: "150",
    priceLabel: "FROM",
    category: "Arts & coffee",
    action: "Register",
    Icon: Coffee,
    image: "/images/hero_event_expo_1791041415699.jpg",
    theme: "art",
  },
  {
    title: "Entoto Community Run",
    venue: "Entoto",
    date: "Oct 18",
    dateTime: "2026-10-18",
    time: "7:00 AM",
    month: "OCT",
    day: "18",
    price: "FREE",
    priceLabel: "ENTRY",
    category: "Outdoors",
    action: "Join the Run",
    Icon: Mountain,
    image: "",
    theme: "outdoors",
  },
];

export function FeaturedEvents({ locale }: { locale: string }) {
  const trackRef = useRef<HTMLDivElement>(null);

  function scrollEvents(direction: -1 | 1) {
    const track = trackRef.current;
    const firstCard = track?.querySelector<HTMLElement>(".featured-stack-card");
    if (!track || !firstCard) return;

    track.scrollBy({
      left: direction * (firstCard.offsetWidth - 80),
      behavior: "smooth",
    });
  }

  return (
    <section
      aria-labelledby="featured-events-heading"
      className="overflow-hidden bg-cream-ivory py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-5 px-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand-red" />
              Always Moving
            </p>
            <h2
              id="featured-events-heading"
              className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
            >
              New events drop{" "}
              <span className="relative inline-block text-brand-red">
                every hour
                <Sparkles
                  aria-hidden="true"
                  className="absolute -right-6 -top-2 size-4 text-brand-gold sm:-right-7 sm:size-5"
                  strokeWidth={1.8}
                />
              </span>
            </h2>
          </div>
          <p className="max-w-md px-4 text-base leading-7 text-text-secondary sm:px-0 sm:text-right">
            Concerts, markets, workshops, community gatherings updated throughout the day.
          </p>
        </div>

        <div
          aria-label="Featured events, scroll horizontally to explore"
          className="featured-stack-track"
          ref={trackRef}
          tabIndex={0}
        >
          {events.map(({ title, venue, date, dateTime, time, month, day, price, priceLabel, category, action, Icon, image, theme }, index) => (
            <Link
              key={title}
              href={`/${locale}/events`}
              aria-label={`${action}: ${title}, ${date} at ${venue}`}
              className={`featured-stack-card featured-stack-card--${theme}`}
              style={{ zIndex: events.length - index }}
            >
              <span aria-hidden="true" className="featured-stack-card__visual">
                {image ? (
                  <Image
                    src={image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 330px, (min-width: 768px) 30vw, 50vw"
                    className="featured-stack-card__image"
                  />
                ) : (
                  <span className="featured-stack-card__art">
                    <span className="featured-stack-card__sun" />
                    <Mountain aria-hidden="true" className="size-40 text-white/80" strokeWidth={1} />
                  </span>
                )}
              </span>
              <span aria-hidden="true" className="featured-stack-card__texture" />

              <div className="featured-stack-card__content">
                <div className="flex items-center justify-between gap-3">
                  <span className="featured-stack-card__category">
                    <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
                    {category}
                  </span>
                  <time dateTime={dateTime} className="featured-stack-card__date">
                    <span>{month}</span>
                    <strong>{day}</strong>
                  </time>
                </div>

                <div className="featured-stack-card__details">
                  <h3 className="font-heading text-3xl font-extrabold leading-[1.05] tracking-tight sm:text-4xl">
                    {title}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-white/85">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
                      {venue}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays aria-hidden="true" className="size-4 text-brand-gold" />
                      {date}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock3 aria-hidden="true" className="size-4 text-brand-gold" />
                      {time}
                    </span>
                  </div>
                  <span className="featured-stack-card__action">
                    {action}
                    <ArrowRight aria-hidden="true" className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" />
                  </span>
                </div>

                <div className="featured-stack-card__price">
                  <span>{priceLabel}</span>
                  <strong>{price}</strong>
                  {price !== "FREE" && <span>ETB</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between px-4">
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text-muted">
            Swipe or use arrows
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Scroll to previous featured event"
              onClick={() => scrollEvents(-1)}
              className="grid size-10 place-items-center rounded-full border border-charcoal/15 bg-white text-charcoal transition hover:border-brand-red hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red motion-reduce:transition-none"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Scroll to next featured event"
              onClick={() => scrollEvents(1)}
              className="grid size-10 place-items-center rounded-full border border-charcoal/15 bg-white text-charcoal transition hover:border-brand-red hover:text-brand-red focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red motion-reduce:transition-none"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>

        <div className="mt-8 px-4 text-center sm:mt-10">
          <Link
            href={`/${locale}/events`}
            className="group inline-flex items-center gap-2 rounded-full px-5 py-3 font-heading font-bold text-brand-red transition-colors hover:bg-brand-red/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red"
          >
            See What&apos;s Fresh
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-200 group-hover:translate-x-1.5 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
