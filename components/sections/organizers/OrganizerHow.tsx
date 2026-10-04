"use client";

import {
  ArrowDown,
  ArrowRight,
  Banknote,
  CalendarDays,
  Link2,
  MapPin,
  QrCode,
  Share2,
  Smartphone,
  Ticket,
  TrendingUp,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create your event",
    description: "Enter name, date, location, price — done in 2 minutes.",
    icon: CalendarDays,
    accent: "bg-brand-red/10 text-brand-red",
  },
  {
    number: "02",
    title: "Share your link",
    description: "Get your link and share anywhere: WhatsApp, Instagram, Telegram.",
    icon: Share2,
    accent: "bg-brand-deep-blue/10 text-brand-deep-blue",
  },
  {
    number: "03",
    title: "Track every ticket",
    description: "Watch sales come in with real-time numbers on your phone.",
    icon: TrendingUp,
    accent: "bg-emerald-500/10 text-emerald-700",
  },
  {
    number: "04",
    title: "Welcome your crowd",
    description: "On event day, scan tickets with your camera.",
    icon: QrCode,
    accent: "bg-[#7c4d9e]/10 text-[#7c4d9e]",
  },
  {
    number: "05",
    title: "Get paid",
    description: "Payout arrives next business day to Telebirr or your bank.",
    icon: Banknote,
    accent: "bg-brand-gold/15 text-[#8a611e]",
  },
];

const flowLabels = [
  { label: "Start", icon: Ticket },
  { label: "Fill 3 fields", icon: CalendarDays },
  { label: "Publish", icon: Smartphone },
  { label: "Share", icon: Link2 },
  { label: "Track", icon: TrendingUp },
  { label: "Get paid", icon: Banknote },
];

export function OrganizerHow() {
  return (
    <section
      aria-labelledby="organizer-how-heading"
      className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            <span className="size-2 rounded-full bg-brand-red" />
            From idea to event day
          </p>
          <h2
            id="organizer-how-heading"
            className="mt-3 font-heading text-3xl font-extrabold tracking-[-0.035em] text-charcoal sm:text-4xl"
          >
            A natural path to{" "}
            <span className="text-brand-red">sold out.</span>
          </h2>
          <p className="mt-3 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
            Everything moves in one simple flow. You bring the event — we help
            you bring the people.
          </p>
        </div>

        <div
          aria-label="Start, fill 3 fields, publish, share, track, get paid"
          className="mt-9 hidden items-center justify-between gap-2 rounded-2xl border border-[#e9e1d4] bg-[#faf8f4] px-5 py-4 lg:flex"
        >
          {flowLabels.map(({ label, icon: Icon }, index) => (
            <div key={label} className="flex min-w-0 flex-1 items-center gap-2">
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-3 py-2 text-xs font-bold text-charcoal shadow-sm">
                <Icon aria-hidden="true" className="size-3.5 text-brand-red" />
                {label}
              </span>
              {index < flowLabels.length - 1 && (
                <ArrowRight
                  aria-hidden="true"
                  className="mx-auto size-4 shrink-0 text-brand-gold"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-7 lg:grid-cols-5 lg:gap-3">
          {steps.map(({ number, title, description, icon: Icon, accent }, index) => (
            <div key={number} className="relative">
              <article className="group h-full rounded-[1.5rem] border border-[#e9e1d4] bg-white p-5 shadow-[0_8px_28px_rgba(42,42,42,0.045)] transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_18px_40px_rgba(42,42,42,0.09)] sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className={`grid size-11 place-items-center rounded-2xl ${accent}`}>
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                  <span className="font-heading text-xs font-bold tracking-[0.14em] text-[#c9c1b4]">
                    {number}
                  </span>
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold tracking-tight text-charcoal">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  {description}
                </p>
              </article>
              {index < steps.length - 1 && (
                <ArrowDown
                  aria-hidden="true"
                  className="absolute -bottom-[1.15rem] left-1/2 z-10 size-5 -translate-x-1/2 text-brand-gold sm:hidden"
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-sm font-semibold text-text-secondary lg:hidden">
          <MapPin aria-hidden="true" className="size-4 text-brand-gold" />
          Built for event organizers in Addis Ababa
        </div>
      </div>
    </section>
  );
}

export default OrganizerHow;