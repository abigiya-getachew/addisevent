import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Events | AddisEvent",
};

export default function OrganizerEventsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-heading text-2xl font-bold text-charcoal">My Events</h1>
      <p className="mt-2 text-sm text-text-secondary">All events you have created.</p>
    </main>
  );
}
