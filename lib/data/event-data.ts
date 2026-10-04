import type { EventListItem } from "../../components/sections/events/EventCard";

export type EventDetails = EventListItem & {
  description: string;
};

export const EVENTS: EventDetails[] = [
  {
    id: "sunset-concert",
    title: "Sunset Concert",
    category: "Live music",
    venue: "Meskel Square",
    date: "October 10, 2026 · 6:00 PM",
    dateTime: "2026-10-10T18:00:00+03:00",
    price: 200,
    image: "/images/hero_event_concert_1791041390305.jpg",
    description:
      "An open-air evening of live music as the sun sets over the city. Join Addis performers and guests for a vibrant night at Meskel Square.",
  },
  {
    id: "cultural-festival",
    title: "Cultural Festival",
    category: "Culture",
    venue: "Piassa",
    date: "October 12, 2026 · All day",
    dateTime: "2026-10-12",
    price: 0,
    image: "/images/hero_event_festival_1791041403567.jpg",
    description:
      "Spend the day celebrating Ethiopian culture with local performances, food, art, and community gatherings in Piassa.",
  },
  {
    id: "art-coffee-workshop",
    title: "Art & Coffee Workshop",
    category: "Arts & coffee",
    venue: "Bole",
    date: "October 14, 2026 · 2:00 PM",
    dateTime: "2026-10-14T14:00:00+03:00",
    price: 150,
    image: "/images/hero_event_expo_1791041415699.jpg",
    description:
      "Make something creative, meet fellow artists, and enjoy freshly brewed Ethiopian coffee at this relaxed hands-on workshop.",
  },
  {
    id: "rooftop-after-dark",
    title: "Rooftop After Dark",
    category: "Nightlife",
    venue: "Kazanchis",
    date: "October 16, 2026 · 8:00 PM",
    dateTime: "2026-10-16T20:00:00+03:00",
    price: 350,
    image: "/images/hero_event_nightclub_1791042109575.jpg",
    description:
      "Take in the city lights with a night of music and dancing at one of Kazanchis’ rooftop venues.",
  },
  {
    id: "entoto-community-run",
    title: "Entoto Community Run",
    category: "Outdoors",
    venue: "Entoto",
    date: "October 18, 2026 · 7:00 AM",
    dateTime: "2026-10-18T07:00:00+03:00",
    price: 0,
    image: "/images/hero_event_festival_1791041403567.jpg",
    description:
      "Start your morning outdoors with a friendly community run through the beautiful Entoto area. All experience levels are welcome.",
  },
  {
    id: "addis-makers-market",
    title: "Addis Makers Market",
    category: "Markets",
    venue: "Mexico Square",
    date: "October 20, 2026 · 10:00 AM",
    dateTime: "2026-10-20T10:00:00+03:00",
    price: 50,
    image: "/images/hero_event_expo_1791041415699.jpg",
    description:
      "Browse a lively collection of handmade goods, food, and original work from independent makers across Addis Ababa.",
  },
  {
    id: "jazz-in-the-garden",
    title: "Jazz in the Garden",
    category: "Live music",
    venue: "Bole Medhanialem",
    date: "October 22, 2026 · 7:00 PM",
    dateTime: "2026-10-22T19:00:00+03:00",
    price: 250,
    image: "/images/hero_event_concert_1791041390305.jpg",
    description:
      "Unwind with an evening of live jazz in a garden setting, featuring local musicians and special guests.",
  },
  {
    id: "design-week-addis",
    title: "Design Week Addis",
    category: "Arts & culture",
    venue: "Addis Ababa Museum",
    date: "October 24, 2026 · 9:00 AM",
    dateTime: "2026-10-24T09:00:00+03:00",
    price: 100,
    image: "/images/hero_event_expo_1791041415699.jpg",
    description:
      "Explore contemporary design, creative projects, and conversations from artists and designers shaping the city.",
  },
];
