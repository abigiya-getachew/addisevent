import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { and, asc, eq } from "drizzle-orm";
import { ArrowRight, Bookmark, CalendarDays, MapPin } from "lucide-react";
import { auth } from "@/auth";
import { SavedEventActions } from "@/components/dashboard/SavedEventActions";
import { db } from "@/lib/db";
import { events, savedEvents, ticketTiers } from "@/server/src/db/schema";

export const metadata: Metadata = {
  title: "Saved Events | AddisEvent",
};

export default async function SavedEventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  const user = session?.user;
  if (!user?.id) redirect(`/${locale}/auth/login`);
  if (user.role === "organizer") redirect(`/${locale}/dashboard/organizer`);
  if (user.role === "admin") redirect(`/${locale}/admin`);

  const rows = await db
    .select({
      id: events.id,
      title: events.title,
      imageUrl: events.imageUrl,
      category: events.category,
      startAt: events.startAt,
      venue: events.venue,
      city: events.city,
      status: events.status,
      isFree: events.isFree,
      tierId: ticketTiers.id,
      tierPrice: ticketTiers.price,
      availableQuantity: ticketTiers.availableQuantity,
      tierActive: ticketTiers.isActive,
      saleStartAt: ticketTiers.saleStartAt,
      saleEndAt: ticketTiers.saleEndAt,
    })
    .from(savedEvents)
    .innerJoin(events, eq(savedEvents.eventId, events.id))
    .leftJoin(ticketTiers, eq(ticketTiers.eventId, events.id))
    .where(eq(savedEvents.userId, user.id))
    .orderBy(asc(events.startAt), asc(ticketTiers.price));

  const now = new Date();
  const saved = new Map<
    string,
    {
      id: string;
      title: string;
      imageUrl: string | null;
      category: string;
      startAt: Date;
      venue: string | null;
      city: string;
      status: typeof rows[number]["status"];
      isFree: boolean;
      lowestPrice: number;
      available: number;
      canBook: boolean;
    }
  >();
  for (const row of rows) {
    let event = saved.get(row.id);
    if (!event) {
      event = {
        id: row.id,
        title: row.title,
        imageUrl: row.imageUrl,
        category: row.category,
        startAt: row.startAt,
        venue: row.venue,
        city: row.city,
        status: row.status,
        isFree: row.isFree,
        lowestPrice: Number.POSITIVE_INFINITY,
        available: 0,
        canBook: false,
      };
      saved.set(row.id, event);
    }

    const tierOnSale =
      row.tierActive &&
      row.availableQuantity > 0 &&
      (!row.saleStartAt || row.saleStartAt <= now) &&
      (!row.saleEndAt || row.saleEndAt >= now);
    if (row.tierId && row.tierActive) {
      event.lowestPrice = Math.min(event.lowestPrice, Number(row.tierPrice));
    }
    if (tierOnSale) {
      event.available += row.availableQuantity;
      event.canBook = true;
    }
  }

  const savedEventsList = Array.from(saved.values());

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-10">
      <header className="mb-8">
        <p className="text-sm font-semibold text-brand-red">Your shortlist</p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight text-charcoal sm:text-3xl">
          Saved events
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Events you’re interested in, ready when you are.
        </p>
      </header>

      {savedEventsList.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {savedEventsList.map((event) => {
            const dateLabel = new Intl.DateTimeFormat(locale, {
              dateStyle: "medium",
              timeStyle: "short",
              timeZone: "Africa/Addis_Ababa",
            }).format(event.startAt);
            const canBook =
              event.status === "published" &&
              event.startAt > now &&
              event.canBook;
            const sellingFast = event.available > 0 && event.available <= 10;

            return (
              <article
                key={event.id}
                className="overflow-hidden rounded-2xl border border-border bg-white shadow-(--shadow-1)"
              >
                <div
                  role={event.imageUrl ? "img" : undefined}
                  aria-label={event.imageUrl ? event.title : undefined}
                  className="relative aspect-[16/8] bg-[#f1e8d9]"
                  style={
                    event.imageUrl
                      ? {
                          backgroundImage: `linear-gradient(0deg, rgb(38 34 31 / 45%), transparent 65%), url("${event.imageUrl.replaceAll('"', "%22")}")`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                        }
                      : undefined
                  }
                >
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-charcoal">
                    {event.category}
                  </span>
                </div>
                <div className="p-5">
                  <h2 className="font-heading text-lg font-bold text-charcoal">
                    {event.title}
                  </h2>
                  <div className="mt-3 space-y-2 text-sm text-text-secondary">
                    <p className="flex items-center gap-2">
                      <CalendarDays aria-hidden="true" className="size-4 text-brand-gold" />
                      {dateLabel}
                    </p>
                    <p className="flex items-center gap-2">
                      <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
                      {[event.venue, event.city].filter(Boolean).join(", ")}
                    </p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <span className="text-sm font-semibold text-charcoal">
                      {event.isFree || event.lowestPrice === 0
                        ? "Free entry"
                        : Number.isFinite(event.lowestPrice)
                          ? `From ${event.lowestPrice.toLocaleString(locale)} ETB`
                          : "Tickets unavailable"}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        canBook
                          ? sellingFast
                            ? "text-[#a86400]"
                            : "text-success"
                          : "text-text-muted"
                      }`}
                    >
                      {canBook
                        ? sellingFast
                          ? "Selling fast"
                          : `${event.available} tickets left`
                        : "Unavailable"}
                    </span>
                  </div>
                  <div className="mt-4">
                    <SavedEventActions
                      eventId={event.id}
                      locale={locale}
                      canBook={canBook}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <section className="rounded-2xl border border-dashed border-border-strong bg-white px-6 py-12 text-center">
          <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-[#f8f0df] text-[#a86400]">
            <Bookmark aria-hidden="true" className="size-6" />
          </span>
          <h2 className="mt-5 font-heading text-xl font-semibold text-charcoal">
            Nothing saved yet
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-text-secondary">
            Save events you’re interested in and they’ll be collected here.
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
