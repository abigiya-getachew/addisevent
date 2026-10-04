import { Metadata } from "next";
import "../globals.css";

import { Hero } from "../../components/sections/home/Hero";
import { FeaturedEvents } from "../../components/sections/home/FeaturedEvents";
import { BrandMarquee } from "../../components/sections/home/BrandMarquee";
import { TwoPaths } from "../../components/sections/home/TwoPaths";
import { ForOrganizers } from "../../components/sections/home/ForOrganizers";
import { Trust } from "../../components/sections/home/Trust";
import { HomeCta } from "../../components/sections/home/HomeCta";

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <div>
    <Hero />
    <FeaturedEvents locale={locale} />
    <BrandMarquee />
    <TwoPaths locale={locale} />
    <section
      aria-labelledby="organizer-bridge-heading"
      className="bg-cream-ivory px-4 py-8 text-center sm:py-10 lg:py-12"
    >
      <div className="mx-auto max-w-3xl">
        <span aria-hidden="true" className="mx-auto mb-4 block h-8 w-px bg-brand-gold/60" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
          For the people behind the moments
        </p>
        <h2
          id="organizer-bridge-heading"
          className="mt-2 font-heading text-xl font-bold tracking-tight text-charcoal sm:text-2xl"
        >
          Ready to make the next one happen?
        </h2>
      </div>
    </section>
    <ForOrganizers locale={locale} />
    <Trust />
    <HomeCta />
  </div>;
}
