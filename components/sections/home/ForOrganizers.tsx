import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

export function ForOrganizers({ locale }: { locale: string }) {
  return (
    <section aria-labelledby="organizers-heading" className="bg-cream-ivory px-4 pt-8 pb-16 sm:pt-10 sm:pb-20 lg:pt-12 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate grid overflow-hidden rounded-[2rem] bg-[#142f59] shadow-[0_28px_80px_rgb(20_47_89/22%)] lg:min-h-[34rem] lg:grid-cols-[1.05fr_0.95fr]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-28 -top-32 -z-10 size-96 rounded-full bg-brand-red/20 blur-3xl"
          />
          <div className="relative z-10 flex flex-col items-start justify-center px-7 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-gold">
              <span aria-hidden="true" className="size-2 rounded-full bg-brand-gold" />
              For Addis event creators
            </p>
            <h2
              id="organizers-heading"
              className="max-w-xl font-heading text-4xl font-black leading-[1.02] tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl"
            >
              Got an event?
              <span className="mt-2 block text-brand-gold">Bring it to life.</span>
            </h2>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
              Bring your people together. We&apos;ll help you get the word out, welcome your crowd,
              and get paid locally.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-white/90">
              <li className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 text-brand-gold" />
                Easy to get started
              </li>
              <li className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 text-brand-gold" />
                Local payments
              </li>
              <li className="inline-flex items-center gap-2">
                <Check aria-hidden="true" className="size-4 text-brand-gold" />
                Tickets by SMS
              </li>
            </ul>

            <div className="mt-9 flex w-full flex-col items-start gap-5 sm:w-auto sm:flex-row sm:items-center">
              <Link
                href={`/${locale}/organizer/new`}
                className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand-gold px-7 py-4 font-heading font-extrabold text-charcoal shadow-[0_10px_36px_rgb(212_160_60/28%)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e2b451] hover:shadow-[0_14px_42px_rgb(212_160_60/38%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none"
              >
                Create Your Event
                <ArrowRight
                  aria-hidden="true"
                  className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
              <Link
                href={`/${locale}/organizer`}
                className="group inline-flex items-center gap-2 font-semibold text-white/80 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
              >
                Already organizing?
                <span className="font-bold text-white">Sign in</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                />
              </Link>
            </div>
          </div>

          <div className="relative min-h-64 overflow-hidden sm:min-h-80 lg:min-h-full">
            <Image
              src="/images/hero_event_festival_1791041403567.jpg"
              alt="A lively cultural celebration bringing the Addis community together"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#101f38]/70 via-[#101f38]/5 to-[#101f38]/10 lg:bg-gradient-to-r lg:from-[#142f59]/35 lg:via-transparent lg:to-transparent"
            />
            <div className="absolute bottom-5 left-5 rounded-2xl border border-white/20 bg-[#142f59]/70 px-4 py-3 text-white shadow-xl backdrop-blur-md sm:bottom-7 sm:left-7">
              <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-brand-gold">
                Your crowd is out there
              </p>
              <p className="mt-1 font-heading text-lg font-bold">Let&apos;s bring them together.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
