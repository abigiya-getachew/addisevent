import Link from "next/link";
import { ArrowRight, BarChart3, Check, Wallet } from "lucide-react";

export function OrganizerHero({ locale }: { locale: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#102442] px-4 py-14 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_80%_15%,rgba(212,160,60,0.2),transparent_34%),radial-gradient(ellipse_at_12%_100%,rgba(224,64,56,0.17),transparent_34%)]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-32 -top-40 -z-10 size-[28rem] rounded-full border border-white/10 sm:size-[38rem]"
      />
      <div
        aria-hidden="true"
        className="absolute -right-12 -top-20 -z-10 size-[22rem] rounded-full border border-brand-gold/15 sm:size-[32rem]"
      />

      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1fr_0.72fr] lg:gap-16">
        <div className="max-w-3xl">
          <p className="inline-flex items-center gap-2.5 rounded-full border border-brand-red/35 bg-brand-red/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-white">
            <span
              aria-hidden="true"
              className="size-2.5 rounded-full bg-brand-red shadow-[0_0_14px_rgba(224,64,56,0.75)]"
            />
            For organizers
          </p>

          <h1 className="mt-6 font-heading text-4xl font-black leading-[1.04] tracking-[-0.045em] text-white sm:text-5xl lg:text-6xl">
            Build Your Event.
            <span className="mt-1 block text-brand-gold">
              Know Your Audience.
            </span>
            <span className="mt-1 block">Get Paid.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg sm:leading-8">
            Publish in 2 minutes. Track sales live from your phone. Payouts next
            business day.
          </p>

          <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link
              href={`/${locale}/organizer/new`}
              className="group inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-brand-gold px-6 py-3.5 font-heading text-sm font-extrabold text-charcoal shadow-[0_12px_36px_rgba(212,160,60,0.25)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#e2b451] hover:shadow-[0_16px_42px_rgba(212,160,60,0.35)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white motion-reduce:transform-none motion-reduce:transition-none sm:px-7 sm:text-base"
            >
              Create Your First Event
              <ArrowRight
                aria-hidden="true"
                className="size-5 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
              <span className="rounded-full bg-charcoal/10 px-2.5 py-1 text-xs font-bold">
                It&apos;s Free
              </span>
            </Link>

            <Link
              href={`/${locale}/organizer`}
              className="group inline-flex items-center gap-2 py-2 text-sm font-semibold text-white/75 transition hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold"
            >
              Already started?
              <span className="font-bold text-brand-gold">Go to Dashboard</span>
              <ArrowRight
                aria-hidden="true"
                className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              />
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:ml-auto">
          <div
            aria-hidden="true"
            className="absolute -inset-5 rounded-[2.25rem] bg-brand-gold/10 blur-2xl"
          />
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/[0.07] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/55">
                  Your event, in control
                </p>
                <p className="mt-2 font-heading text-xl font-bold text-white sm:text-2xl">
                  Made for the moment
                </p>
              </div>
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-gold/15 text-brand-gold">
                <BarChart3 aria-hidden="true" className="size-5" />
              </span>
            </div>

            <div className="mt-7 rounded-2xl border border-white/10 bg-[#0b1d35]/70 p-4 sm:p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-medium text-white/55">Ticket sales</p>
                  <p className="mt-1 font-heading text-2xl font-bold text-white">
                    Live, wherever you are
                  </p>
                </div>
                <span className="grid size-10 place-items-center rounded-full bg-emerald-400/10 text-emerald-300">
                  <BarChart3 aria-hidden="true" className="size-5" />
                </span>
              </div>
              <div className="mt-5 flex h-20 items-end gap-2" aria-hidden="true">
                {[34, 48, 40, 62, 50, 74, 58, 88, 68, 100, 76, 92].map(
                  (height, index) => (
                    <span
                      key={index}
                      className={`flex-1 rounded-t-md ${
                        index > 8 ? "bg-brand-gold" : "bg-white/20"
                      }`}
                      style={{ height: `${height}%` }}
                    />
                  ),
                )}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <Check aria-hidden="true" className="size-4 text-brand-gold" />
                <p className="mt-3 text-sm font-bold text-white">Go live fast</p>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  Publish in minutes
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <Wallet aria-hidden="true" className="size-4 text-brand-gold" />
                <p className="mt-3 text-sm font-bold text-white">Get paid</p>
                <p className="mt-1 text-xs leading-5 text-white/55">
                  Payout next business day
                </p>
              </div>
            </div>
          </div>
          <span
            aria-hidden="true"
            className="absolute -bottom-4 -left-5 size-12 rounded-2xl border border-brand-gold/30 bg-brand-gold/10 sm:-left-7"
          />
        </div>
      </div>
    </section>
  );
}

export default OrganizerHero;
