import { CheckCircle2, Handshake, Landmark, LockKeyhole } from "lucide-react";

const trustPoints = [
  {
    title: "Proudly Local",
    description: "Built right here in Addis, for our city. We know what matters to you.",
    Icon: Landmark,
    iconColor: "text-brand-red",
    iconBackground: "bg-brand-red/10",
  },
  {
    title: "Verified Events",
    description: "Every listing checked. No scams, no surprises. Real events, real people.",
    Icon: CheckCircle2,
    iconColor: "text-success",
    iconBackground: "bg-success/10",
  },
  {
    title: "Trusted Payments",
    description: "Telebirr and CBE Birr, the names you already know and trust.",
    Icon: LockKeyhole,
    iconColor: "text-brand-deep-blue",
    iconBackground: "bg-brand-deep-blue/10",
  },
  {
    title: "Community First",
    description: "We always list free events because this platform is here for all of us.",
    Icon: Handshake,
    iconColor: "text-brand-gold",
    iconBackground: "bg-brand-gold/15",
  },
];

export function Trust() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="bg-cream-ivory px-4 py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center sm:mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-text-muted">
            A place for all of us
          </p>
          <h2
            id="trust-heading"
            className="font-heading text-3xl font-bold tracking-tight text-charcoal sm:text-4xl lg:text-5xl"
          >
            For <span className="text-brand-red">Everyone</span>, Everywhere
          </h2>
          <span
            aria-hidden="true"
            className="trust-underline mx-auto mt-5 block h-1 w-20 rounded-full bg-brand-gold"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {trustPoints.map(({ title, description, Icon, iconColor, iconBackground }) => (
            <article
              key={title}
              className="rounded-2xl border border-charcoal/5 bg-white p-6 shadow-[0_6px_24px_rgb(42_42_42/5%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_32px_rgb(42_42_42/9%)] motion-reduce:transform-none motion-reduce:transition-none sm:p-7"
            >
              <div
                className={`mb-5 grid size-14 place-items-center rounded-2xl ${iconBackground}`}
              >
                <Icon
                  aria-hidden="true"
                  className={`size-7 ${iconColor}`}
                  strokeWidth={1.8}
                />
              </div>
              <h3 className="mb-2 font-heading text-lg font-bold text-charcoal">
                {title}
              </h3>
              <p className="text-sm leading-6 text-text-secondary sm:text-base">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
