import { CreditCard, Search, Smartphone } from "lucide-react";

const steps = [
  {
    title: "Discover",
    description: "Search events in your language. Filter by neighbourhood, date, or vibe.",
    Icon: Search,
    number: "01",
  },
  {
    title: "Choose & Pay",
    description: "Pay with Telebirr or CBE Birr, or reserve now and pay at the gate.",
    Icon: CreditCard,
    number: "02",
  },
  {
    title: "Show Up",
    description: "Your ticket arrives by SMS. Just scan it and enjoy the event. No app needed.",
    Icon: Smartphone,
    number: "03",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-labelledby="how-it-works-heading"
      className="relative overflow-hidden bg-cream-ivory px-4 py-16 sm:py-20 lg:py-24"
    >
      <div aria-hidden="true" className="about-top-rule absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center sm:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
            Your plans, made simple
          </p>
          <h2
            id="how-it-works-heading"
            className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
          >
            How It <span className="text-brand-red">Works</span>
          </h2>
          <span aria-hidden="true" className="trust-underline mx-auto mt-5 block h-1 w-20 rounded-full bg-brand-gold" />
        </header>

        <div className="relative grid gap-4 md:grid-cols-3 md:gap-5">
          <div
            aria-hidden="true"
            className="absolute left-[17%] right-[17%] top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent md:block"
          />
          {steps.map(({ title, description, Icon, number }, index) => (
            <article
              key={title}
              className="relative rounded-3xl border border-charcoal/5 bg-white p-6 shadow-[0_8px_28px_rgb(42_42_42/5%)] transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_16px_36px_rgb(212_160_60/12%)] motion-reduce:transform-none motion-reduce:transition-none sm:p-8"
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="relative z-10 grid size-16 place-items-center rounded-2xl border border-brand-gold/30 bg-cream-ivory text-brand-red shadow-[0_0_0_8px_white]">
                  <Icon aria-hidden="true" className="size-7" strokeWidth={1.8} />
                </span>
                <span className="font-heading text-sm font-extrabold tracking-[0.2em] text-brand-gold">
                  {number}
                </span>
              </div>
              <h3 className="font-heading text-xl font-bold text-charcoal">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
                {description}
              </p>
              {index < steps.length - 1 && (
                <span aria-hidden="true" className="absolute -right-2 top-10 z-20 hidden size-4 rotate-45 border-r border-t border-brand-gold/60 bg-cream-ivory md:block" />
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
