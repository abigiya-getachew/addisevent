import { EventDiscovery } from "../../../components/sections/events/EventDiscovery";

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return <EventDiscovery locale={locale} />;
}