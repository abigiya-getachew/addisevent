const BEFORE = [
  "Events scattered across 5 apps and groups",
  "Tickets lost, forgotten, or fake",
  "No single trusted source to check",
];

const AFTER = [
  { text: "One place for everything happening" },
  { text: "Tickets straight to SMS. Works on every phone" },
  { text: "Every listing reviewed — book with confidence" },
  { text: "Organizers keep more, grow faster, get paid sooner" },
];

export function Why() {
  return (
    <section
      aria-labelledby="why-we-exist-heading"
      className="relative overflow-hidden bg-[#0e1c2f] px-4 py-16 sm:py-20 lg:py-24"
    >
      {/* Faint gold cross overlay */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.05]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="why-cross"
            x="0"
            y="0"
            width="48"
            height="48"
            patternUnits="userSpaceOnUse"
          >
            <rect x="20" y="22" width="8" height="4" rx="1" fill="#D4A03C" />
            <rect x="22" y="20" width="4" height="8" rx="1" fill="#D4A03C" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#why-cross)" />
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl">
        <header className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-gold">
            Why we exist
          </p>
          <h2
            id="why-we-exist-heading"
            className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl"
          >
            We fixed what was{" "}
            <span className="text-brand-red">broken</span>
          </h2>
          <span
            aria-hidden="true"
            className="mx-auto mt-5 block h-1 w-20 rounded-full bg-brand-gold"
          />
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Before */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-7 backdrop-blur-sm sm:p-9">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-red">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-red" />
              Before AddisEvent
            </p>
            <ul className="space-y-4" role="list">
              {BEFORE.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-6 text-white/65">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-brand-red/70"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* After */}
          <div className="rounded-2xl border border-brand-gold/25 bg-white/5 p-7 backdrop-blur-sm sm:p-9">
            <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-brand-gold/35 bg-brand-gold/10 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-gold">
              <span aria-hidden="true" className="size-1.5 rounded-full bg-brand-gold" />
              Now
            </p>
            <ul className="space-y-4" role="list">
              {AFTER.map(({ text }) => (
                <li key={text} className="flex items-start gap-3 text-sm leading-6 text-white/80">
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-[#16A34A]"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
