import { ArrowUpRight, CreditCard, Languages, Smartphone } from "lucide-react";

const features = [
  {
    title: "Bilingual, Not Afterthought",
    description: "Enjoy Amharic and English equally, switch languages instantly, and skip awkward translations.",
    Icon: Languages,
    accent: "text-brand-red",
    iconBackground: "bg-brand-red/10",
    number: "01",
  },
  {
    title: "Any Phone Works",
    description: "Book by SMS on any phone, even without a smartphone. It is simple and saves your data.",
    Icon: Smartphone,
    accent: "text-brand-deep-blue",
    iconBackground: "bg-brand-deep-blue/10",
    number: "02",
  },
  {
    title: "Truly Local Payments",
    description: "Pay with Telebirr or CBE Birr. You can even reserve now and pay when you arrive.",
    Icon: CreditCard,
    accent: "text-[#98701f]",
    iconBackground: "bg-brand-gold/15",
    number: "03",
  },
];

export function WhyMakesUsSpecial() {
  return (
    <section
      aria-labelledby="why-special-heading"
      className="relative overflow-hidden bg-cream-ivory px-4 py-16 text-charcoal sm:py-20 lg:py-24"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 -top-32 size-96 rounded-full border border-brand-gold/15"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-12 -top-16 size-64 rounded-full border border-brand-red/5"
      />
      <div className="relative mx-auto max-w-7xl">
        <header className="mb-10 max-w-3xl sm:mb-14">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-brand-red">
            Your unique edge
          </p>
          <h2
            id="why-special-heading"
            className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl"
          >
            What Makes Us <span className="text-brand-red">Different</span>
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-text-secondary sm:text-lg">
            Why choose us over every other site?
          </p>
        </header>

        <div className="border-t border-charcoal/15">
          {features.map(({ title, description, Icon, accent, iconBackground, number }) => (
            <article
              key={title}
              className="group grid gap-5 border-b border-charcoal/15 py-7 transition-colors duration-200 hover:bg-white/60 motion-reduce:transition-none sm:grid-cols-[5rem_minmax(0,1fr)_auto] sm:items-center sm:gap-8 sm:py-8"
            >
              <span className="font-heading text-sm font-bold tracking-[0.2em] text-text-muted">
                {number}
              </span>
              <div className="flex items-start gap-4 sm:gap-6">
                <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${iconBackground} ${accent} transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none`}>
                  <Icon aria-hidden="true" className="size-6" strokeWidth={1.8} />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-bold text-charcoal sm:text-xl">{title}</h3>
                  <p className="mt-1 max-w-2xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
                    {description}
                  </p>
                </div>
              </div>
              <ArrowUpRight
                aria-hidden="true"
                className="hidden size-5 text-brand-gold transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transition-none sm:block"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
