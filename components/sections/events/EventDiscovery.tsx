"use client";

import { useMemo, useState } from "react";
import { EventHero, type EventFilters } from "./EventHero";
import { EventList } from "./EventList";
import { EVENTS } from "../../../lib/data/event-data";

export function EventDiscovery({ locale }: { locale: string }) {
  const [filters, setFilters] = useState<EventFilters>({
    query: "",
    date: "",
    category: "",
    location: "",
  });

  const categories = useMemo(
    () => [...new Set(EVENTS.map((event) => event.category))].sort(),
    [],
  );
  const locations = useMemo(
    () => [...new Set(EVENTS.map((event) => event.venue))].sort(),
    [],
  );

  const filteredEvents = useMemo(() => {
    const query = filters.query.trim().toLocaleLowerCase();
    const now = new Date();
    const daysUntilSaturday = (6 - now.getDay() + 7) % 7;
    const saturday = new Date(now);
    saturday.setDate(now.getDate() + (daysUntilSaturday || (now.getDay() === 6 ? 0 : 7)));
    saturday.setHours(0, 0, 0, 0);
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);
    sunday.setHours(23, 59, 59, 999);

    return EVENTS.filter((event) => {
      const matchesSearch =
        !query ||
        [event.title, event.category, event.venue, event.description ?? ""].some(
          (value) => value.toLocaleLowerCase().includes(query),
        );
      const matchesCategory =
        !filters.category || event.category === filters.category;
      const matchesLocation =
        !filters.location || event.venue === filters.location;
      const eventDate = new Date(event.dateTime);
      const matchesDate =
        !filters.date ||
        (filters.date === "weekend" &&
          eventDate >= saturday &&
          eventDate <= sunday) ||
        (filters.date === "month" &&
          eventDate.getFullYear() === now.getFullYear() &&
          eventDate.getMonth() === now.getMonth());

      return matchesSearch && matchesCategory && matchesLocation && matchesDate;
    });
  }, [filters]);

  function updateFilter(key: keyof EventFilters, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f9f6f0_0%,#fffdf9_55%,#f9f6f0_100%)]">
      <EventHero
        filters={filters}
        categories={categories}
        locations={locations}
        onFilterChange={updateFilter}
      />
      <EventList events={filteredEvents} locale={locale} />
    </div>
  );
}

export default EventDiscovery;
