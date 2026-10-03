import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HomeCta() {
  return (
    <section
      aria-labelledby="home-cta-heading"
      className="home-cta-section relative isolate overflow-hidden bg-brand-red px-4 py-20 text-center sm:py-24 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-32 -z-10 size-96 rounded-full bg-white/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -right-20 -z-10 size-96 rounded-full bg-charcoal/10 blur-3xl"
      />

      <div className="mx-auto max-w-5xl">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.24em] text-white/75 sm:text-sm">
          Addis is waiting for you
        </p>
        <h2
          id="home-cta-heading"
          className="font-heading text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Your Moment Is Waiting.
          <br />
          <span className="text-brand-gold">Be There.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/90 sm:mt-7 sm:text-lg sm:leading-8">
          Thousands are discovering Addis with us. Come see what&apos;s happening.
        </p>

        <Link
          href="/events"
          className="home-cta-button group mt-9 inline-flex min-h-16 items-center justify-center gap-3 rounded-full bg-brand-gold px-8 py-4 font-heading text-lg font-extrabold text-charcoal shadow-[0_10px_32px_rgb(42_42_42/20%)] transition duration-200 hover:scale-105 hover:bg-[#e2b451] hover:shadow-[0_14px_42px_rgb(42_42_42/28%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none sm:mt-10 sm:min-h-[4.5rem] sm:px-10 sm:text-xl"
        >
          Explore All Events
          <ArrowRight
            aria-hidden="true"
            className="size-6 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
          />
        </Link>
      </div>
    </section>
  );
}
