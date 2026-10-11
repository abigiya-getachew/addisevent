import type { Metadata } from "next";
import { auth } from "@/auth";
import { OrganizerOverview } from "@/components/dashboard/OrganizerOverview";
import { OrganizerHero } from "@/components/sections/organizers/OrganizerHero";
import { OrganizerFeatures } from "@/components/sections/organizers/OrganizerFeatures";
import { OrganizerHow } from "@/components/sections/organizers/OrganizerHow";
import { OrganizerCta } from "@/components/sections/organizers/OrganizerCta";

export const metadata: Metadata = {
  title: "For Organizers | AddisEvent",
};

export default async function OrganizerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const [{ locale }, session] = await Promise.all([params, auth()]);

  if (session?.user?.role === "organizer" || session?.user?.role === "admin") {
    return <OrganizerOverview />;
  }

  return (
    <>
      <OrganizerHero locale={locale} />
      <OrganizerFeatures />
      <OrganizerHow />
      <OrganizerCta locale={locale} />
    </>
  );
}
