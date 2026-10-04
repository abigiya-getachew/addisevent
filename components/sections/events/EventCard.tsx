import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";

export type EventListItem = {
  id: string;
  title: string;
  category: string;
  venue: string;
  date: string;
  dateTime: string;
  price: number;
  image: string;
  description?: string;
};

type EventCardProps = {
  event: EventListItem;
  href?: string;
  variant?: "listing" | "detail";
};

export function EventCard({
  event,
  href,
  variant = "listing",
}: EventCardProps) {
  const isDetail = variant === "detail";
  const eventDate = new Date(event.dateTime);
  const dateMonth = new Intl.DateTimeFormat("en", {
    month: "short",
    timeZone: "Africa/Addis_Ababa",
  }).format(eventDate);
  const dateDay = new Intl.DateTimeFormat("en", {
    day: "2-digit",
    timeZone: "Africa/Addis_Ababa",
  }).format(eventDate);
  const content = (
    <>
      <div
        className={`relative overflow-hidden bg-[#f1e8d9] ${
          isDetail ? "aspect-[16/8] sm:aspect-[16/7]" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={event.image}
          alt=""
          fill
          priority={isDetail}
          sizes={
            isDetail
              ? "(min-width: 1280px) 1280px, 100vw"
              : "(min-width: 1280px) 380px, (min-width: 768px) 45vw, 100vw"
          }
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/5 to-charcoal/10 transition-opacity duration-300 group-hover:from-charcoal/75" />
        <span className="absolute left-4 top-4 rounded-full border border-white/60 bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal shadow-sm backdrop-blur">
          {event.category}
        </span>
        {!isDetail && (
          <time
            dateTime={event.dateTime}
            className="absolute right-4 top-4 grid min-w-14 place-items-center rounded-xl border border-white/60 bg-white/95 px-2.5 py-2 text-charcoal shadow-sm backdrop-blur"
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-brand-red">
              {dateMonth}
            </span>
            <strong className="font-heading text-xl leading-5">{dateDay}</strong>
          </time>
        )}
        <span className="absolute bottom-4 left-4 rounded-full bg-charcoal/90 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
          {event.price === 0 ? "Free entry" : `From ${event.price.toLocaleString()} ETB`}
        </span>
      </div>

      <div className={isDetail ? "p-5 sm:p-8" : "p-5"}>
        {isDetail ? (
          <h1 className="font-heading text-3xl font-bold tracking-tight text-charcoal transition-colors group-hover:text-brand-red sm:text-4xl lg:text-5xl">
            {event.title}
          </h1>
        ) : (
          <h2 className="font-heading text-xl font-bold tracking-tight text-charcoal transition-colors group-hover:text-brand-red">
            {event.title}
          </h2>
        )}
        {!isDetail && event.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-text-secondary">
            {event.description}
          </p>
        )}
        <div className="mt-4 flex flex-col gap-2 text-sm text-text-secondary sm:flex-row sm:flex-wrap sm:gap-x-6">
          <span className="inline-flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="size-4 shrink-0 text-brand-gold" />
            <time dateTime={event.dateTime}>{event.date}</time>
          </span>
          <span className="inline-flex items-center gap-2">
            <MapPin aria-hidden="true" className="size-4 shrink-0 text-brand-gold" />
            {event.venue}
          </span>
        </div>
        {isDetail && event.description && (
          <p className="mt-5 max-w-3xl leading-7 text-text-secondary">
            {event.description}
          </p>
        )}
        <div className="mt-5 flex items-center justify-between gap-4 border-t border-[#eee8dd] pt-4">
          <p className="text-sm font-semibold text-charcoal">
            {event.price === 0 ? "Free admission" : `From ${event.price.toLocaleString()} ETB`}
          </p>
          {href ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-bold text-white transition group-hover:bg-[#c93630]">
              Book Now
              <ArrowRight aria-hidden="true" className="size-4" />
            </span>
          ) : isDetail ? (
            <a
              href="#ticket-tiers"
              className="inline-flex items-center gap-2 rounded-full bg-brand-red px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#c93630] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-red"
            >
              Choose tickets
              <ArrowRight aria-hidden="true" className="size-4" />
            </a>
          ) : null}
        </div>
      </div>
    </>
  );

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-border bg-white shadow-(--shadow-1) transition duration-200 hover:shadow-(--shadow-2) ${
        isDetail ? "" : "hover:-translate-y-1"
      }`}
    >
      {href ? (
        <Link
          href={href}
          aria-label={`Book ${event.title}`}
          className="block"
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </article>
  );
}