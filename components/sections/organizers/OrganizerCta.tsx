import Link from "next/link";
import { ArrowRight, MessageCircle, Rocket } from "lucide-react";

export function OrganizerCta({ locale }: { locale: string }) {
  return (
    <section className="bg-[#f9f6f0] px-4 pb-16 sm:px-6 sm:pb-20 lg:px-8 lg:pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-[#102442] px-6 py-12 text-center shadow-[0_24px_64px_rgba(16,36,66,0.18)] sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_120%,rgba(212,160,60,0.24),transparent_54%),radial-gradient(ellipse_at_0%_0%,rgba(224,64,56,0.16),transparent_36%)]"
          />
          <span
            aria-hidden="true"
            className="absolute -right-16 -top-24 -z-10 size-64 rounded-full border border-white/10 sm:size-80"
          />
          <span
            aria-hidden="true"
            className="absolute -left-24 -bottom-40 -z-10 size-80 rounded-full border border-brand-gold/15"
          />

          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-gold">
            Your next chapter starts here
          </p>
          <h2 className="mx-auto mt-3 max-w-3xl font-heading text-3xl font-extrabold tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl">
            Your Event Deserves{" "}
            <span className="text-brand-gold">to Be Found</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base sm:leading-7">
            Zero setup fees. No monthly cost. You keep more of what you earn.
          </p>

          <Link
            href={`/${locale}/organizer/new`}
            className="group mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand-gold px-7 py-4 font-heading text-base font-extrabold text-charcoal shadow-[0_12px_32px_rgba(212,160,60,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e2b451] hover:shadow-[0_16px_40px_rgba(212,160,60,0.38)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none sm:px-9 sm:text-lg"
          >
            <Rocket aria-hidden="true" className="size-5" />
            Start Creating — Free
            <ArrowRight
              aria-hidden="true"
              className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
            />
          </Link>

          <p className="mt-6 flex flex-wrap items-center justify-center gap-x-2 text-sm text-white/65">
            <span>Questions? We reply fast</span>
            <span aria-hidden="true">→</span>
            <a
              href="mailto:support@addisevent.com?subject=Organizer%20question"
              className="inline-flex items-center gap-1.5 font-bold text-white underline decoration-brand-gold/70 underline-offset-4 transition hover:text-brand-gold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
            >
              <MessageCircle aria-hidden="true" className="size-4" />
              Chat with us
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

export default OrganizerCta;