import { OrganizerHero } from "../../../components/sections/organizers/OrganizerHero";
import { OrganizerFeatures } from "../../../components/sections/organizers/OrganizerFeatures";
import { OrganizerHow } from "../../../components/sections/organizers/OrganizerHow";
import { OrganizerCta } from "../../../components/sections/organizers/OrganizerCta";

export default async function OrganizerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <>
      <OrganizerHero locale={locale} />
      <OrganizerFeatures />
      <OrganizerHow />
      <OrganizerCta locale={locale} />
    </>
  );
}