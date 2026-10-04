import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function JoinUs() {
  return (
    <section
      aria-labelledby="join-us-heading"
      className="bg-cream-ivory px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-3xl text-center">
        <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red">
          What&apos;s next
        </p>

        <h2
          id="join-us-heading"
          className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl"
        >
          We&apos;re just getting{" "}
          <span className="text-brand-red">started</span>
        </h2>

        <span
          aria-hidden="true"
          className="mx-auto mt-5 block h-1 w-20 rounded-full bg-brand-gold"
        />

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-text-secondary sm:text-lg sm:leading-8">
          New cities, new features, new ways to connect communities. Coming
          soon. Be the first to know.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="#newsletter"
            className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand-red px-8 py-4 font-heading font-extrabold text-white shadow-[0_10px_36px_rgb(224_64_56/28%)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#c0312a] hover:shadow-[0_14px_42px_rgb(224_64_56/38%)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-red motion-reduce:transform-none motion-reduce:transition-none"
          >
            Follow Updates
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
