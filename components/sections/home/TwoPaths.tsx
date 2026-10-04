import Link from "next/link";
import { ArrowRight, CalendarDays, Ticket } from "lucide-react";

const paths = [
  {
    title: "I'm Attending",
    description: [
      "See what's happening today, tomorrow, this weekend",
      "Pay the way you already use",
      "Ticket arrives by SMS. Show it and enter.",
    ],
    href: "events",
    action: "Explore Events",
    Icon: Ticket,
    className: "bg-white text-charcoal",
    iconClassName: "bg-brand-red/10 text-brand-red",
    bulletClassName: "bg-brand-red",
    buttonClassName: "bg-brand-red text-white hover:bg-[#c0312a]",
  },
  {
    title: "I'm Organizing",
    description: [
      "Publish your event in 2 minutes",
      "Track sales live from your phone",
      "Payouts to your Telebirr next day",
    ],
    href: "organizer",
    action: "Start Creating",
    Icon: CalendarDays,
    className: "bg-charcoal text-white",
    iconClassName: "bg-brand-gold/15 text-brand-gold",
    bulletClassName: "bg-brand-gold",
    buttonClassName: "bg-brand-gold text-charcoal hover:bg-[#e2b451]",
  },
];

export function TwoPaths({ locale }: { locale: string }) {
  return (
    <section
      aria-labelledby="two-paths-heading"
      className="bg-cream-ivory px-4 pt-16 pb-8 sm:pt-20 sm:pb-10 lg:pt-24 lg:pb-12"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center sm:mb-12">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
            Two paths. One city.
          </p>
          <h2
            id="two-paths-heading"
            className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
          >
            Choose your <span className="text-brand-red">lane</span>
          </h2>
        </header>

        <div className="grid gap-5 md:grid-cols-2 md:gap-6">
          {paths.map(
            ({
              title,
              description,
              href,
              action,
              Icon,
              className,
              iconClassName,
              bulletClassName,
              buttonClassName,
            }) => (
              <article
                key={title}
                className={`flex flex-col rounded-3xl border border-charcoal/5 p-7 shadow-[0_12px_36px_rgb(42_42_42/7%)] sm:p-9 lg:p-10 ${className}`}
              >
                <span className={`mb-6 grid size-14 place-items-center rounded-2xl ${iconClassName}`}>
                  <Icon aria-hidden="true" className="size-7" strokeWidth={1.8} />
                </span>
                <h3 className="font-heading text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {title}
                </h3>
                <ul className="mt-6 grid gap-4 text-sm leading-6 sm:text-base">
                  {description.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span
                        className={`mt-2 size-2 shrink-0 rounded-full ${bulletClassName}`}
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${locale}/${href}`}
                  className={`group mt-8 inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-full px-6 py-3 font-heading font-bold transition duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-gold motion-reduce:transform-none motion-reduce:transition-none ${buttonClassName}`}
                >
                  {action}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-5 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none"
                  />
                </Link>
              </article>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
