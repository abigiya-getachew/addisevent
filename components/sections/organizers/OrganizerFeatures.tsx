import {
  ArrowRight,
  BarChart3,
  Check,
  Link2,
  QrCode,
  Ticket,
  TrendingUp,
  Wallet,
} from "lucide-react";

const features = [
  {
    title: "Live Sales Dashboard",
    description:
      "See tickets selling in real-time. Updated every minute from any device.",
    action: "Preview Dashboard",
    icon: BarChart3,
    accent: "text-brand-red",
    iconBackground: "bg-brand-red/10",
    visual: (
      <div className="flex h-12 items-end gap-1.5" aria-hidden="true">
        {[34, 52, 42, 68, 56, 84, 66, 100, 76, 90].map((height, index) => (
          <span
            key={index}
            className={`flex-1 rounded-t-sm ${
              index > 7 ? "bg-brand-red" : "bg-brand-red/20"
            }`}
            style={{ height: `${height}%` }}
          />
        ))}
        <span className="ml-2 self-start rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-700">
          <span className="mr-1 inline-block size-1.5 rounded-full bg-emerald-500" />
          LIVE
        </span>
      </div>
    ),
  },
  {
    title: "Phone Check-In",
    description:
      "Scan QR tickets with your camera. No special hardware, no extra app.",
    action: "See How It Works",
    icon: QrCode,
    accent: "text-brand-deep-blue",
    iconBackground: "bg-brand-deep-blue/10",
    visual: (
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="grid size-9 place-items-center rounded-lg border border-brand-deep-blue/15 bg-brand-deep-blue/[0.04]">
          <QrCode className="size-5 text-brand-deep-blue" />
        </span>
        <span className="h-px flex-1 bg-gradient-to-r from-brand-deep-blue/40 to-transparent" />
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1.5 text-[10px] font-bold text-emerald-700">
          <Check className="size-3" />
          Ticket verified
        </span>
      </div>
    ),
  },
  {
    title: "Fast Local Payouts",
    description:
      "Direct to Telebirr or CBE account. Next business day. No hidden fees.",
    action: "Payout Details",
    icon: Wallet,
    accent: "text-[#8a611e]",
    iconBackground: "bg-brand-gold/15",
    visual: (
      <div
        className="flex items-center justify-between rounded-xl border border-brand-gold/20 bg-brand-gold/[0.06] px-3 py-2"
        aria-hidden="true"
      >
        <span className="text-xs font-semibold text-text-secondary">
          Next payout
        </span>
        <span className="font-heading text-sm font-extrabold text-charcoal">
          ETB <span className="text-brand-red">→</span> Your account
        </span>
      </div>
    ),
  },
  {
    title: "Reach Beyond Followers",
    description:
      "Your event shown to people browsing Addis. New audience every day.",
    action: "Boost Visibility",
    icon: TrendingUp,
    accent: "text-emerald-700",
    iconBackground: "bg-emerald-500/10",
    visual: (
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="flex -space-x-2">
          {["bg-brand-red", "bg-brand-gold", "bg-brand-deep-blue", "bg-emerald-600"].map(
            (color, index) => (
              <span
                key={index}
                className={`grid size-7 place-items-center rounded-full border-2 border-white ${color} text-[9px] font-bold text-white`}
              >
                {["A", "M", "S", "T"][index]}
              </span>
            ),
          )}
        </span>
        <span className="text-xs font-semibold text-text-secondary">
          New faces finding your event
        </span>
      </div>
    ),
  },
  {
    title: "Flexible Ticket Types",
    description:
      "Free, paid, VIP, group pricing — set your tiers, your prices.",
    action: "Set Up Tiers",
    icon: Ticket,
    accent: "text-[#7c4d9e]",
    iconBackground: "bg-[#7c4d9e]/10",
    visual: (
      <div className="flex flex-wrap gap-1.5" aria-hidden="true">
        {["Free", "Standard", "VIP", "Group"].map((tier, index) => (
          <span
            key={tier}
            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
              index === 2
                ? "bg-[#7c4d9e] text-white"
                : "border border-[#7c4d9e]/15 bg-[#7c4d9e]/[0.04] text-[#604078]"
            }`}
          >
            {tier}
          </span>
        ))}
      </div>
    ),
  },
  {
    title: "Custom Event Page",
    description:
      "Your design, your info. Clean, shareable link for WhatsApp & Telegram.",
    action: "Claim Your Link",
    icon: Link2,
    accent: "text-[#b35426]",
    iconBackground: "bg-[#b35426]/10",
    visual: (
      <div
        className="flex items-center gap-2 rounded-xl border border-[#b35426]/15 bg-[#b35426]/[0.04] px-3 py-2"
        aria-hidden="true"
      >
        <Link2 className="size-3.5 shrink-0 text-[#b35426]" />
        <span className="truncate text-xs font-semibold text-text-secondary">
          addisevent.com/e/your-event
        </span>
        <span className="ml-auto shrink-0 rounded-full bg-white px-2 py-1 text-[9px] font-bold text-emerald-700 shadow-sm">
          SHARE
        </span>
      </div>
    ),
  },
];

export function OrganizerFeatures() {
  return (
    <section
      aria-labelledby="organizer-features-heading"
      className="bg-[linear-gradient(180deg,#f9f6f0_0%,#fffdf9_100%)] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-9 flex flex-col gap-4 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              <span className="size-2 rounded-full bg-brand-red" />
              Built for your next big night
            </p>
            <h2
              id="organizer-features-heading"
              className="mt-3 font-heading text-3xl font-extrabold tracking-[-0.035em] text-charcoal sm:text-4xl"
            >
              Everything to make it{" "}
              <span className="text-brand-red">happen.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-text-secondary sm:text-base sm:leading-7">
              Simple tools to get your event out there, welcome your crowd, and
              stay in control from the first ticket to the final song.
            </p>
          </div>
          <div className="hidden items-center gap-2 rounded-full border border-[#e8dfd1] bg-white px-3.5 py-2 text-xs font-semibold text-text-secondary shadow-sm sm:inline-flex">
            <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.35)]" />
            Made for Addis organizers
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group relative flex min-h-[260px] flex-col overflow-hidden rounded-[1.5rem] border border-[#e9e1d4] bg-white p-5 shadow-[0_8px_28px_rgba(42,42,42,0.045)] transition duration-300 hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-[0_20px_44px_rgba(42,42,42,0.1)] sm:p-6"
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-10 -top-12 size-32 rounded-full bg-[#f9f6f0] transition-transform duration-500 group-hover:scale-125"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <span
                    className={`grid size-12 place-items-center rounded-2xl ${feature.iconBackground} ${feature.accent} transition-transform duration-300 group-hover:scale-105`}
                  >
                    <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
                  </span>
                  <span className="font-heading text-xs font-bold tracking-[0.12em] text-[#c9c1b4]">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="relative mt-5 font-heading text-xl font-bold tracking-tight text-charcoal">
                  {feature.title}
                </h3>
                <p className="relative mt-2 text-sm leading-6 text-text-secondary">
                  {feature.description}
                </p>

                <div className="relative mt-5 rounded-xl bg-[#faf8f4] px-3 py-2.5">
                  {feature.visual}
                </div>

                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  <span className="inline-flex items-center gap-2 text-sm font-bold text-charcoal transition-colors group-hover:text-brand-red">
                    {feature.action}
                    <ArrowRight
                      aria-hidden="true"
                      className="size-4 text-brand-red transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </span>
                  <span
                    aria-hidden="true"
                    className="h-px flex-1 bg-gradient-to-r from-[#e9e1d4] to-transparent"
                  />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default OrganizerFeatures;