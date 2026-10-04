import { notFound } from "next/navigation";
import { EventCard } from "../../../../components/sections/events/EventCard";
import { TicketTier } from "../../../../components/sections/events/TicketTier";
import { EVENTS } from "../../../../lib/data/event-data";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const event = EVENTS.find((item) => item.id === id);

  if (!event) {
    notFound();
  }

  return (
    <div className="px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <EventCard event={event} variant="detail" />
        <div className="lg:sticky lg:top-28">
          <TicketTier price={event.price} />
        </div>
      </div>
    </div>
  );
}