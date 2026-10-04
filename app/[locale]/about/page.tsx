import type { Metadata } from "next";

import { AboutHero } from "../../../components/sections/about/Hero";
import { WhoWeAre } from "../../../components/sections/about/WhoWeAre";
import { Why } from "../../../components/sections/about/Why";
import { JoinUs } from "../../../components/sections/about/JoinUs";

export const metadata: Metadata = {
  title: "About — AddisEvent",
  description:
    "AddisEvent was built because your city deserves one trusted place to discover, book, and share events — no app download, no confusion, no extra cost.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <WhoWeAre />
      <Why />
      <JoinUs />
    </>
  );
}
