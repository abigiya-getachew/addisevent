export function AboutHero() {
  return (
    <section
      aria-labelledby="about-hero-heading"
      className="relative overflow-hidden bg-[#0e1c2f] px-4 py-24 sm:py-32 lg:py-40"
    >
      {/* Subtle gold cross-pattern overlay */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="about-cross"
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
        <rect width="100%" height="100%" fill="url(#about-cross)" />
      </svg>

      {/* Warm radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 65% 55% at 50% 60%, rgba(224,64,56,0.12) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.22em] text-brand-gold">
          About AddisEvent
        </p>

        <h1
          id="about-hero-heading"
          className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl"
        >
          Events Belong to{" "}
          <span className="text-brand-red">Everyone</span>
        </h1>

        {/* Gold underline accent */}
        <span
          aria-hidden="true"
          className="mx-auto mt-6 block h-1 w-20 rounded-full bg-brand-gold"
        />

        <p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg sm:leading-8">
          AddisEvent was built because your city deserves one trusted place to
          discover, book, and share. No app download, no confusion, no extra
          cost.
        </p>
      </div>
    </section>
  );
}
