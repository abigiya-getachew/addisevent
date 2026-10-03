import { Metadata } from "next";
import "../globals.css";

import { Hero } from "../../components/sections/home/Hero";
import { HowItWorks } from "../../components/sections/home/HowItWorks";
import { WhyMakesUsSpecial } from "../../components/sections/home/WhyMakesUsSpecial";
import { FeaturedEvents } from "../../components/sections/home/FeaturedEvents";
import { ForOrganizers } from "../../components/sections/home/ForOrganizers";
import { Trust } from "../../components/sections/home/Trust";
import { HomeCta } from "../../components/sections/home/HomeCta";


export default function Home() {
  return <div>
    <Hero />
    <HowItWorks />
    <WhyMakesUsSpecial />
    <FeaturedEvents />
    <ForOrganizers />
    <Trust />
    <HomeCta />
  </div>;
}
