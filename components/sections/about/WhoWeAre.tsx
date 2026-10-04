const PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
          fill="currentColor"
        />
      </svg>
    ),
    label: "Born & built in Addis Ababa",
    description:
      "Designed for the city's pace, culture, and communities. Not adapted from elsewhere.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
        <rect x="2" y="6" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M2 10h20M7 15h2M13 15h4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "Local payments first",
    description:
      "Telebirr and CBE Birr are the primary checkout options. Not afterthoughts bolted on later.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
        <path
          d="M4 6h16M4 12h10M4 18h7"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="19" cy="17" r="3" stroke="currentColor" strokeWidth="1.8" />
        <path d="M21.5 19.5l1.5 1.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
    label: "Bilingual by design",
    description:
      "Amharic and English as equals. Not a toggle hidden in settings.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
        <path
          d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    ),
    label: "For real people & real events",
    description:
      "Concerts, festivals, workshops, community gatherings. Not just big-venue blockbusters.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="size-6">
        <path
          d="M12 2L3 7l9 5 9-5-9-5zM3 17l9 5 9-5M3 12l9 5 9-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    label: "Zero hidden fees",
    description:
      "No markup. No surprises at checkout. Fair for attendees and fair for organizers.",
  },
];

export function WhoWeAre() {
  return (
    <section
      aria-labelledby="who-we-are-heading"
      className="bg-cream-ivory px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-red">
            Who we are
          </p>
          <h2
            id="who-we-are-heading"
            className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
          >
            Born in Addis,{" "}
            <span className="text-brand-red">built for Addis</span>
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-1 w-20 rounded-full bg-brand-gold"
          />
        </header>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {PILLARS.map(({ icon, label, description }) => (
            <li
              key={label}
              className="flex gap-4 rounded-2xl border border-charcoal/5 bg-white p-6 shadow-[0_4px_16px_rgb(42_42_42/5%)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-gold/40 hover:shadow-[0_8px_28px_rgb(212_160_60/10%)] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span
                aria-hidden="true"
                className="mt-0.5 grid size-11 shrink-0 place-items-center rounded-xl border border-brand-gold/25 bg-cream-ivory text-brand-red"
              >
                {icon}
              </span>
              <div>
                <h3 className="font-heading text-base font-bold text-charcoal">
                  {label}
                </h3>
                <p className="mt-1.5 text-sm leading-6 text-text-secondary">
                  {description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
