import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  ScanLine,
  UsersRound,
} from "lucide-react";

const benefits = [
  { label: "Reach your crowd", Icon: UsersRound },
  { label: "Take local payments", Icon: Banknote },
  { label: "Easy check-in", Icon: ScanLine },
];

export function ForOrganizers() {
  return (
    <section
      aria-labelledby="organizers-heading"
      className="organizer-section relative isolate overflow-hidden px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.92fr] lg:gap-16">
        <div className="relative z-10">
          <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-brand-gold">
            <span aria-hidden="true" className="size-2 rounded-full bg-brand-gold" />
            For the people who bring Addis together
          </p>
          <h2
            id="organizers-heading"
            className="max-w-2xl font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            You bring people together.
            <span className="mt-2 block text-brand-gold">We&apos;ll help fill the room.</span>
          </h2>
          <p className="mt-6 max-w-xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Your next great event deserves to be discovered. Reach people across Addis, sell tickets
            with local payments, and welcome guests with less hassle, so you can focus on the moment
            you&apos;re creating.
          </p>

          <Link
            href="/organizer/new"
            className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand-gold px-7 py-4 font-heading font-bold text-charcoal shadow-[0_10px_36px_rgb(212_160_60/28%)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e2b451] hover:shadow-[0_14px_42px_rgb(212_160_60/38%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transform-none motion-reduce:transition-none sm:px-8"
          >
            Become an Organizer
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
          <p className="mt-3 text-sm text-white/55">
            Your idea. Your people. Let&apos;s make it happen.
          </p>

          <ul className="mt-9 flex flex-wrap gap-x-6 gap-y-4 border-t border-white/15 pt-6">
            {benefits.map(({ label, Icon }) => (
              <li key={label} className="inline-flex items-center gap-2 text-sm font-semibold text-white/85">
                <Icon aria-hidden="true" className="size-4 text-brand-gold" strokeWidth={1.9} />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-xl lg:ml-auto">
          <div
            aria-hidden="true"
            className="absolute -inset-3 rotate-3 rounded-4xl border border-brand-gold/35 bg-brand-gold/10"
          />
          <div className="relative aspect-4/3 overflow-hidden rounded-3xl border border-white/20 bg-[#31517b] shadow-[0_30px_80px_rgb(0_0_0/35%)] sm:aspect-5/4">
            <Image
              src="/images/hero_event_festival_1791041403567.jpg"
              alt="Friends celebrating together at a lively outdoor event in Addis Ababa"
              fill
              sizes="(min-width: 1024px) 44vw, 100vw"
              className="object-cover transition-transform duration-700 hover:scale-105 motion-reduce:transition-none"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-[#111c30]/85 via-[#111c30]/5 to-[#111c30]/10"
            />
            <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full border border-white/30 bg-[#142f59]/55 px-3 py-2 text-xs font-bold text-white shadow-lg backdrop-blur-md sm:left-7 sm:top-7">
              <BadgeCheck aria-hidden="true" className="size-4 text-brand-gold" />
              MADE FOR ADDIS
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-gold">
                Your next event starts here
              </p>
              <p className="mt-2 max-w-sm font-heading text-2xl font-extrabold leading-tight sm:text-3xl">
                Turn your idea into everyone&apos;s next favourite night.
              </p>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-2 hidden -rotate-3 items-center gap-3 rounded-2xl border border-charcoal/5 bg-cream-ivory px-4 py-3 text-charcoal shadow-[0_16px_40px_rgb(0_0_0/25%)] sm:flex lg:-left-8">
            <span className="grid size-10 place-items-center rounded-xl bg-brand-red/10 text-brand-red">
              <UsersRound aria-hidden="true" className="size-5" />
            </span>
            <span>
              <strong className="block font-heading text-sm">Bring your people</strong>
              <span className="text-xs text-text-muted">We&apos;ll help them find you</span>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
